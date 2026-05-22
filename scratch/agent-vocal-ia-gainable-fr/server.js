import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { supabase } from './db.js';
import { importCSVProspects } from './services/enrichment_service.js';
import { analyzeCall, processScheduledFollowUps } from './services/post_call_analyzer.js';
import { SYSTEM_PROMPT } from './prompts/agent_prompt.js';
import { sendDemoAlert, sendCallbackAlert, sendAcquisitionEmail } from './services/mailer_service.js';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// Helper to simulate a human pause before speaking
function randomDelay() {
  // 300‑800 ms pause
  return Math.floor(Math.random() * 500) + 300;
}

function sendState(ws, state, text, action = null) {
  setTimeout(() => {
    const payload = { event: 'state_update', state, text };
    if (action) payload.action = action;
    ws.send(JSON.stringify(payload));
  }, randomDelay());
}

function shortenCompanyName(name) {
  if (!name) return "";
  let cleanName = name.replace(/\(.*?\)/g, '');
  
  const separators = [
    /\bclimatisation\b/i,
    /\bclim\b/i,
    /\bpompe\s+à\s+chaleur\b/i,
    /\bpac\b/i,
    /\bchauffage\b/i,
    /\bplomberie\b/i,
    /\bélectrici\w*\b/i,
    /\benergy\b/i,
    /\bénergie\w*\b/i,
    /\brenovation\b/i,
    /\brénovation\w*\b/i,
    /\bmultiservice\w*\b/i,
    /\bsarl\b/i,
    /\bsas\b/i,
    /\beurl\b/i,
    /\bsecurite\b/i,
    /\bsécurité\b/i,
    /\bpeinture\b/i,
    /\bcarrelage\b/i,
    /\bcloisons\b/i,
    /\bisolation\b/i,
    /\bcouverture\b/i,
    /\bmaçonnerie\b/i,
    /\bmaconnerie\b/i,
    /\bconstruction\b/i,
    /\bservices?\b/i,
    /\bgroup\w*\b/i,
    /\bfrance\b/i,
    /\b- \b/,
    /\b:\b/,
    /\b\|\b/
  ];

  let shortestIndex = cleanName.length;
  for (const sep of separators) {
    const match = cleanName.match(sep);
    if (match && match.index > 0 && match.index < shortestIndex) {
      shortestIndex = match.index;
    }
  }

  let short = cleanName.substring(0, shortestIndex).trim();
  short = short.replace(/[\s\-,.+&|/]+$/, '').trim();

  if (short.length < 3) {
    const words = name.split(/\s+/);
    if (words.length > 3) {
      return words.slice(0, 3).join(' ');
    }
    return name;
  }
  return short;
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, 'prompts', 'agent_config.json');

// Charger la configuration de l'agent (Prompt + Objections)
function getAgentConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[Config] Erreur lecture agent_config.json, utilisation du défaut :", err);
  }
  // Par défaut si absent
  return {
    system_prompt: SYSTEM_PROMPT,
    objections: []
  };
}


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(express.text({ type: 'text/csv' }));

// CORS Middleware to allow cross-origin requests (e.g. from IDE preview on port 57581)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static('public'));

// Periodiquement, vérifier les callbacks (toutes les minutes)
setInterval(async () => {
  try {
    await processScheduledFollowUps();
  } catch (err) {
    console.error("[Scheduler Interval] Erreur :", err);
  }
}, 60000);

// --- REST API ENDPOINTS ---

// Liste des prospects
app.get('/api/prospects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('pre_call_score', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un prospect manuel
app.post('/api/prospects', async (req, res) => {
  try {
    const { name, phone, email, city, activity } = req.body;
    
    // Normaliser telephone
    let formattedPhone = phone.replace(/[\s\.\-\(\)]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+33' + formattedPhone.substring(1);
    }

    // Calculer score simplifie pour insertion manuelle directe
    const score = activity && (activity.toLowerCase().includes('clim') || activity.toLowerCase().includes('pac')) ? 85 : 60;

    const { data, error } = await supabase
      .from('prospects')
      .insert({
        name,
        phone: formattedPhone,
        email,
        city,
        activity_detected: activity || 'climatisation',
        pre_call_score: score,
        status: 'pending',
        source: 'manual'
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un prospect
app.delete('/api/prospects/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Importer un CSV
app.post('/api/import', async (req, res) => {
  try {
    const csvContent = req.body;
    const missionName = req.query.mission || 'Import Tableau de Bord';
    if (!csvContent) {
      return res.status(400).json({ error: "Contenu CSV manquant" });
    }
    const result = await importCSVProspects(csvContent, missionName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Liste noire (Blacklist)
app.get('/api/blacklist', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blacklist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blacklist', async (req, res) => {
  try {
    const { phone, reason } = req.body;
    const { data, error } = await supabase
      .from('blacklist')
      .insert({ phone, reason })
      .select()
      .single();

    if (error) throw error;
    
    // Supprimer aussi le prospect correspondant si present
    await supabase.from('prospects').delete().eq('phone', phone);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistiques globales du Dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const { count: prospectsCount } = await supabase.from('prospects').select('*', { count: 'exact', head: true });
    const { count: callsCount } = await supabase.from('calls').select('*', { count: 'exact', head: true });
    
    // Demos planifiees
    const { count: demosCount } = await supabase
      .from('follow_ups')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'demo');
      
    // Callbacks planifies en attente
    const { count: callbacksCount } = await supabase
      .from('follow_ups')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'callback')
      .eq('status', 'pending');

    res.json({
      prospectsCount: prospectsCount || 0,
      callsCount: callsCount || 0,
      demosCount: demosCount || 0,
      callbacksCount: callbacksCount || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer l'historique complet des appels
app.get('/api/calls', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('calls')
      .select('*, prospects(name, city)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les rappels programmés (callbacks)
app.get('/api/callbacks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, calls(prospects(name, phone))')
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fin d'appel simulé (Simulateur Browser)
app.post('/api/simulate-call-end', async (req, res) => {
  try {
    const { prospectId, duration, status, transcription, conversionStatus, followUpDetails } = req.body;
    const result = await analyzeCall({
      prospectId,
      duration,
      status,
      transcription,
      conversionStatus,
      followUpDetails
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Force le traitement des rappels immédiats (pour test/démo)
app.get('/api/scheduler/tick', async (req, res) => {
  try {
    await processScheduledFollowUps();
    res.json({ success: true, message: "Vérification des rappels exécutée." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configuration de l'agent (Prompt + Objections)
app.get('/api/agent-config', (req, res) => {
  try {
    const config = getAgentConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agent-config', (req, res) => {
  try {
    const newConfig = req.body;
    if (!newConfig.system_prompt) {
      return res.status(400).json({ error: "Le prompt système est requis." });
    }
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
    res.json({ success: true, config: newConfig });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy ElevenLabs voices (évite les erreurs CORS du navigateur)
app.get('/api/elevenlabs/voices', async (req, res) => {
  const apiKey = req.headers['xi-api-key'];
  if (!apiKey) {
    return res.status(400).json({ error: "Clé API ElevenLabs manquante (header xi-api-key requis)." });
  }
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey }
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy ElevenLabs TTS (évite les erreurs CORS du navigateur)
app.post('/api/elevenlabs/tts', async (req, res) => {
  const apiKey = req.headers['xi-api-key'];
  if (!apiKey) {
    return res.status(400).json({ error: "Clé API ElevenLabs manquante." });
  }
  const { voice_id, text, stability = 0.75, similarity_boost = 0.85 } = req.body;
  if (!voice_id || !text) {
    return res.status(400).json({ error: "voice_id et text sont requis." });
  }
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability, similarity_boost }
      })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.detail?.message || `Erreur ElevenLabs ${response.status}` });
    }
    // Transférer le flux audio directement au client
    res.setHeader('Content-Type', 'audio/mpeg');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GESTION TWILIO (OUTBOUND / INBOUND CALL HANDLE) ---

app.post('/twilio-voice', (req, res) => {
  const serverDomain = process.env.SERVER_DOMAIN || req.headers.host;
  const protocol = serverDomain.includes('localhost') || serverDomain.includes('127.0.0.1') ? 'ws' : 'wss';
  
  res.type('text/xml');
  res.send(`
    <Response>
      <Connect>
        <Stream url="${protocol}://${serverDomain}/media-stream" />
      </Connect>
    </Response>
  `);
});


// --- ROUTAGE DES WEBSOCKETS (Twilio Stream et Simulation Client) ---

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  
  if (url.pathname === '/media-stream') {
    handleTwilioMediaStream(ws);
  } else if (url.pathname === '/simulation-stream') {
    handleBrowserSimulationStream(ws, url.searchParams);
  } else {
    ws.close();
  }
});

// Logique du flux audio Twilio (Realtime OpenAI Bridge)
function handleTwilioMediaStream(ws) {
  console.log("[Twilio Stream] Client connecté.");
  let openAiWs = null;
  let streamSid = null;
  let currentProspect = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.event === 'start') {
        streamSid = data.start.streamSid;
        console.log(`[Twilio Stream] Flux démarré. StreamSid : ${streamSid}`);
        
        // Initialiser la connexion OpenAI Realtime
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey.includes('your_openai_api_key_here')) {
          console.error("[Twilio Stream] OPENAI_API_KEY non configurée.");
          ws.close();
          return;
        }

        openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });

        setupOpenAiBridge(ws, openAiWs, streamSid);
      }

      if (data.event === 'media' && openAiWs && openAiWs.readyState === WebSocket.OPEN) {
        // Envoyer l'audio Twilio (g711_mulaw) à OpenAI
        const audioPayload = data.media.payload;
        openAiWs.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: audioPayload
        }));
      }

      if (data.event === 'stop') {
        console.log("[Twilio Stream] Flux arrêté.");
        if (openAiWs) openAiWs.close();
      }
    } catch (err) {
      console.error("[Twilio Stream] Erreur message :", err);
    }
  });

  ws.on('close', () => {
    console.log("[Twilio Stream] Client déconnecté.");
    if (openAiWs) openAiWs.close();
  });
}

// Relais OpenAI Realtime pour Twilio
function setupOpenAiBridge(twilioWs, openAiWs, streamSid) {
  openAiWs.on('open', () => {
    console.log("[OpenAI Realtime] Connecté à l'API OpenAI.");
    
    // Envoyer la configuration de session
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: getAgentConfig().system_prompt,
        voice: 'alloy', // Ash, Ballad, Coral, Sage, Shimmer
        input_audio_format: 'g711_mulaw',
        output_audio_format: 'g711_mulaw',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [
          {
            type: 'function',
            name: 'transferCall',
            description: "Transfère l'appel téléphonique en direct vers M. Marwan."
          },
          {
            type: 'function',
            name: 'scheduleDemo',
            description: "Planifie un rendez-vous (démo) de 10 minutes avec M. Marwan ou enregistre une demande de rappel si l'artisan est occupé.",
            parameters: {
              type: 'object',
              properties: {
                date: { type: 'string', description: 'Date AAAA-MM-JJ' },
                time: { type: 'string', description: 'Heure HH:MM' },
                reason: { type: 'string', description: 'Raison du rappel' }
              },
              required: ['date', 'time']
            }
          },
          {
            type: 'function',
            name: 'blacklistNumber',
            description: "Ajoute le numéro de téléphone actuel à la liste noire (blacklist) pour ne plus recontacter.",
            parameters: {
              type: 'object',
              properties: {
                phone: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['phone']
            }
          }
        ]
      }
    };
    
    openAiWs.send(JSON.stringify(sessionConfig));
  });

  openAiWs.on('message', async (message) => {
    try {
      const response = JSON.parse(message);

      // Si OpenAI génère de l'audio delta, on le pousse directement à Twilio
      if (response.type === 'response.audio.delta' && response.delta) {
        twilioWs.send(JSON.stringify({
          event: 'media',
          streamSid: streamSid,
          media: {
            payload: response.delta
          }
        }));
      }

      // Si l'utilisateur commence à parler (Barge-in / Interruption)
      if (response.type === 'input_audio_buffer.speech_started') {
        console.log("[OpenAI Realtime] L'utilisateur parle. Interruption de la parole de Valentin.");
        // Effacer le buffer audio de Twilio pour couper le son en cours
        twilioWs.send(JSON.stringify({
          event: 'clear',
          streamSid: streamSid
        }));
        // Annuler la réponse en cours d'OpenAI
        openAiWs.send(JSON.stringify({
          type: 'response.cancel'
        }));
      }

      // Gestion des appels d'outils (Tool Calls)
      if (response.type === 'response.function_call_arguments.done') {
        const { name, arguments: argsString, call_id } = response;
        const args = JSON.parse(argsString);
        console.log(`[Tool Call] Exécution de l'outil "${name}" :`, args);

        let result = { success: true };

        if (name === 'transferCall') {
          // Transfert Twilio en direct (simulation ou via TwiML Dial)
          console.log(`[Twilio Action] Transfert de l'appel vers ${process.env.HUMAN_TRANSFER_PHONE_NUMBER}`);
          // On répond à l'outil
          openAiWs.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call_id,
              output: JSON.stringify({ status: "transferred", number: process.env.HUMAN_TRANSFER_PHONE_NUMBER })
            }
          }));
        } 
        
        else if (name === 'scheduleDemo') {
          // Inséré en base de données ultérieurement via le post-call analyzer ou directement
          console.log(`[Tool Action] Planification Démo/Callback demandée :`, args);
          openAiWs.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call_id,
              output: JSON.stringify({ status: "scheduled", ...args })
            }
          }));
        } 
        
        else if (name === 'blacklistNumber') {
          try {
            await supabase.from('blacklist').insert({ phone: args.phone, reason: args.reason || 'Demande client' });
            await supabase.from('prospects').delete().eq('phone', args.phone);
            console.log(`[Tool Action] Numéro ${args.phone} ajouté à la blacklist.`);
          } catch (err) {
            console.error("Erreur d'ajout blacklist :", err.message);
          }

          openAiWs.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call_id,
              output: JSON.stringify({ status: "blacklisted", phone: args.phone })
            }
          }));
        }

        // Demander à OpenAI de reprendre après la réponse de l'outil
        openAiWs.send(JSON.stringify({ type: 'response.create' }));
      }

    } catch (err) {
      console.error("[OpenAI Bridge] Erreur traitement message OpenAI :", err);
    }
  });

  openAiWs.on('error', (err) => {
    console.error("[OpenAI Realtime] Erreur WebSocket OpenAI :", err);
  });

  openAiWs.on('close', () => {
    console.log("[OpenAI Realtime] Fermé.");
  });
}

async function getAIResponse(messages, prospect) {
  const tools = [
    {
      type: 'function',
      function: {
        name: 'transferCall',
        description: "Transfère l'appel téléphonique en direct vers M. Marwan."
      }
    },
    {
      type: 'function',
      function: {
        name: 'scheduleDemo',
        description: "Planifie un rendez-vous (démo) de 10 minutes avec M. Marwan ou enregistre une demande de rappel si l'artisan est occupé.",
        parameters: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Date au format AAAA-MM-JJ' },
            time: { type: 'string', description: 'Heure au format HH:MM' },
            reason: { type: 'string', description: 'Raison du rappel' }
          },
          required: ['date', 'time']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'blacklistNumber',
        description: "Ajoute le numéro de téléphone actuel à la liste noire (blacklist) pour ne plus recontacter.",
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string' },
            reason: { type: 'string' }
          },
          required: ['phone']
        }
      }
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: tools,
      tool_choice: 'auto'
    });

    const choice = response.choices[0];
    const message = choice.message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      console.log(`[Simulation Tool Call] Outil "${name}" appelé :`, args);

      let action = null;
      let toolOutput = "";

      if (name === 'transferCall') {
        action = { type: 'transferCall', phone: process.env.HUMAN_TRANSFER_PHONE_NUMBER || '+33600000000' };
        toolOutput = JSON.stringify({ status: "transferred", number: action.phone });
      } 
      
      else if (name === 'scheduleDemo') {
        action = { type: 'demo', date: args.date, time: args.time, reason: args.reason || 'Rappel' };
        toolOutput = JSON.stringify({ status: "scheduled", ...args });
      } 
      
      else if (name === 'blacklistNumber') {
        try {
          await supabase.from('blacklist').insert({ phone: args.phone, reason: args.reason || 'Demande client' });
          await supabase.from('prospects').delete().eq('phone', args.phone);
          console.log(`[Simulation Tool Action] Numéro ${args.phone} ajouté à la blacklist.`);
        } catch (err) {
          console.error("Erreur d'ajout blacklist :", err.message);
        }
        action = { type: 'blacklistNumber', phone: args.phone, reason: args.reason || 'Demande client' };
        toolOutput = JSON.stringify({ status: "blacklisted", phone: args.phone });
      }

      messages.push(message);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolOutput
      });

      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages
      });

      return {
        text: secondResponse.choices[0].message.content,
        state: name === 'blacklistNumber' ? 'REJECTED' : (name === 'scheduleDemo' ? 'INTERESTED' : 'CONVERSATION'),
        action: action
      };
    }

    let state = 'CONVERSATION';
    const textLower = (message.content || '').toLowerCase();
    if (textLower.includes('au revoir') || textLower.includes('bonne journée') || textLower.includes('bonne continuation')) {
      state = 'REJECTED';
    }

    return {
      text: message.content,
      state: state,
      action: null
    };

  } catch (err) {
    console.error("[getAIResponse] Erreur Completions API :", err);
    return {
      text: "Désolé, j'ai un petit souci technique. On peut reprendre ?",
      state: 'ERROR',
      action: null
    };
  }
}

// Logique du simulateur de navigateur (Visual Sandbox)
function handleBrowserSimulationStream(ws, params) {
  const prospectId = params.get('prospectId');
  console.log(`[Simulation Stream] Client connecté pour le prospect : ${prospectId}`);

  const apiKey = process.env.OPENAI_API_KEY;
  const hasOpenAi = apiKey && !apiKey.includes('your_openai_api_key_here');

  if (hasOpenAi) {
    console.log("[Simulation Stream] Mode API Réel activé (OpenAI Chat Completions).");

    supabase.from('prospects').select('*').eq('id', prospectId).single()
      .then(async ({ data: prospect }) => {
        if (!prospect) {
          ws.send(JSON.stringify({ event: 'error', text: 'Prospect introuvable' }));
          ws.close();
          return;
        }

        const shortName = shortenCompanyName(prospect.name);
        const config = getAgentConfig();
        
        let customizedPrompt = config.system_prompt
          .replace(/\{\{COMPANY_NAME\}\}/g, prospect.name)
          .replace(/\{\{CITY\}\}/g, prospect.city || 'votre ville')
          .replace(/\{\{GOOGLE_RATING\}\}/g, prospect.google_rating || 'N/A')
          .replace(/\{\{GOOGLE_REVIEWS_COUNT\}\}/g, prospect.google_reviews_count || '0')
          .replace(/\{\{HAS_WEBSITE\}\}/g, prospect.has_website ? 'Oui' : 'Non');

        const fullSystemPrompt = `${customizedPrompt}

INSTRUCTIONS SUPPLÉMENTAIRES POUR CE PROSPECT:
- Nom officiel de l'entreprise: "${prospect.name}"
- Nom court à utiliser à l'oral (pour faire naturel): "${shortName}" (NE dis JAMAIS le nom officiel complet s'il est long ou contient des mots-clés comme "climatisation", dis simplement "${shortName}").
- Ville: "${prospect.city || 'votre secteur'}"
- Note Google: ${prospect.google_rating || 'N/A'}/5 (${prospect.google_reviews_count || 0} avis)
- A un site internet: ${prospect.has_website ? 'Oui' : 'Non'}

RÈGLE D'INTRODUCTION:
Tu es Valentin et tu appelles ce prospect. Tu commences l'appel. Ton premier message doit être exactement: "Bonjour, je cherche à joindre le responsable de ${shortName}, c'est bien vous ?"`;

        let messageHistory = [
          { role: 'system', content: fullSystemPrompt }
        ];

        // Envoyer la première phrase d'introduction
        const introText = `Bonjour, je cherche à joindre le responsable de ${shortName}, c'est bien vous ?`;
        messageHistory.push({ role: 'assistant', content: introText });
        sendState(ws, 'INTRO', introText);

        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            if (data.event === 'user_input') {
              const userText = data.text;
              messageHistory.push({ role: 'user', content: userText });

              const aiResponse = await getAIResponse(messageHistory, prospect);
              if (aiResponse.text) {
                messageHistory.push({ role: 'assistant', content: aiResponse.text });
                sendState(ws, aiResponse.state || 'CONVERSATION', aiResponse.text, aiResponse.action);
              }
            }
          } catch (err) {
            console.error("[Simulation Stream OpenAI] Erreur traitement message :", err);
          }
        });
      });

  } else {
    // Mode Simulation Locale Pure (sans clé API)
    console.log("[Simulation Stream] Mode API absent. Simulation locale via la machine à états.");
    
    supabase.from('prospects').select('*').eq('id', prospectId).single()
      .then(({ data: prospect }) => {
        if (!prospect) {
          ws.send(JSON.stringify({ event: 'error', text: 'Prospect introuvable' }));
          ws.close();
          return;
        }

        let currentState = 'INTRO';
        sendState(ws, currentState, `Bonjour, je cherche à joindre le responsable de ${prospect.name}, c'est bien vous ?`);

        ws.on('message', (message) => {
          const data = JSON.parse(message);
          
          if (data.event === 'user_input') {
            const text = data.text.toLowerCase();
            let responseText = "";
            let nextState = currentState;
            let actionTriggered = null;

            // Regular expression to extract email
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
            const emailMatch = text.match(emailRegex);

            // Charger la configuration des objections
            const config = getAgentConfig();
            const matchedObjection = config.objections.find(obj => {
              if (obj.id === 'obj_7' && (currentState === 'INTRO' || currentState === 'CURIOUS')) {
                return false;
              }
              return obj.triggers.some(trigger => text.includes(trigger.toLowerCase().trim()));
            });

            if (matchedObjection && currentState !== 'ASK_EMAIL' && currentState !== 'CONFIRM_EMAIL' && currentState !== 'email_proposition') {
              nextState = matchedObjection.next_state;
              responseText = matchedObjection.response
                .replace(/\{\{COMPANY_NAME\}\}/g, prospect.name)
                .replace(/\{\{CITY\}\}/g, prospect.city || 'votre secteur')
                .replace(/\{\{GOOGLE_RATING\}\}/g, prospect.google_rating || 'N/A')
                .replace(/\{\{GOOGLE_REVIEWS_COUNT\}\}/g, prospect.google_reviews_count || '0');
              
              // If the matched objection leads to email_proposition and we already have an email in the user's sentence
              if (nextState === 'email_proposition' && emailMatch) {
                ws.extractedEmail = emailMatch[0];
                nextState = 'CONFIRM_EMAIL';
                const formattedEmail = ws.extractedEmail.replace('@', ' arobase ').replace(/\./g, ' point ');
                responseText = `D'accord, je note : ${formattedEmail}. C'est bien ça ?`;
              }
              
              if (matchedObjection.action) {
                actionTriggered = {
                  type: matchedObjection.action.type,
                  phone: prospect.phone,
                  reason: matchedObjection.action.reason || matchedObjection.title
                };
              }
            } else {
              // Logique de repli par défaut si aucun trigger ne matche ou si on est dans un état d'e-mail
              if (currentState === 'INTRO') {
                if (text.includes('oui') || text.includes('moi') || text.includes('parler') || text.includes('bonjour')) {
                  nextState = 'CURIOUS';
                  responseText = `Super, je vous appelle car j’ai vu que vous étiez installateur sur ${prospect.city || 'votre secteur'}, félicitations pour vos ${prospect.google_reviews_count || 5} avis Google et votre note de ${prospect.google_rating || 4.5}/5. Du coup, vous achetez déjà des leads aujourd’hui ou vous vous reposez sur le bouche‑à‑oreille ?`;
                } else if (text.includes('occupé') || text.includes('chantier') || text.includes('pas le temps') || text.includes('rappeler')) {
                  nextState = 'OCCUPIED';
                  responseText = "Pas de soucis, je comprends tout à fait. Quel jour et à quelle heure vous conviendrait le mieux pour qu'on vous rappelle rapidement ?";
                } else {
                  nextState = 'CURIOUS';
                  responseText = `Je vous appelle car j'ai repéré votre fiche Google sur ${prospect.city || 'votre secteur'}. Nous référençons des installateurs climatisation en exclusivité locale. Est-ce que vous seriez ouvert à développer votre clientèle en direct ?`;
                }
              } else if (currentState === 'OCCUPIED') {
                nextState = 'rappel';
                responseText = "Parfait, c'est bien noté. M. Marwan vous recontactera précisément à ce créneau. Bonne journée !";
                actionTriggered = { type: 'scheduleDemo', date: '2026-05-22', time: '14:00', reason: 'Rappel (Artisan occupé)' };
              } else if (currentState === 'CURIOUS') {
                nextState = 'PITCHED';
                responseText = `Chez Gainable.fr, on ne vend pas de leads : c’est un abonnement exclusif par ville, et notre IA crée en 1 minute des articles SEO qui vous placent en haut de Google et génèrent des appels directs. Ça vous parle ou on s’arrête là ?`;
              } else if (currentState === 'PITCHED') {
                if (text.includes('oui') || text.includes('d\'accord') || text.includes('ok') || text.includes('pourquoi pas') || text.includes('allez') || text.includes('voir') || text.includes('intéressé') || text.includes('interesse') || text.includes('veux bien') || text.includes('volontiers') || text.includes('parle') || text.includes('marche') || text.includes('raconte')) {
                  nextState = 'INTERESTED';
                  responseText = "Super ! Quelle date et heure vous arrangeraient cette semaine pour une courte démo de 10 minutes en visio avec mon responsable ?";
                } else if (text.includes('non') || text.includes('pas intéressé') || text.includes('pas interesse') || text.includes('stop') || text.includes('arret') || text.includes('arrête')) {
                  nextState = 'REJECTED';
                  responseText = `C’est noté, je comprends. Je vous souhaite une excellente continuation. Bonne journée !`;
                } else {
                  nextState = 'INTERESTED';
                  responseText = "D'accord. Écoutez, le plus simple c'est qu'on vous montre ça en 5 minutes sur un cas concret avec mon responsable. Vous seriez disponible quel jour cette semaine pour un rapide appel ?";
                }
              } else if (currentState === 'DEFENSIVE') {
                if (text.includes('oui') || text.includes('d\'accord') || text.includes('ok') || text.includes('pourquoi pas') || text.includes('allez') || text.includes('voir') || text.includes('intéressé') || text.includes('interesse') || text.includes('veux bien') || text.includes('volontiers')) {
                  nextState = 'INTERESTED';
                  responseText = "Super ! Quelle date et heure vous arrangeraient cette semaine pour une courte démo de 10 minutes en visio avec mon responsable ?";
                } else {
                  nextState = 'REJECTED';
                  responseText = `C’est noté, je comprends. Je mets à jour votre dossier pour ne plus vous recontacter. Bonne continuation.`;
                  actionTriggered = { type: 'blacklistNumber', phone: prospect.phone, reason: 'Refus après objection' };
                }
              } else if (currentState === 'email_proposition' || currentState === 'ASK_EMAIL') {
                if (emailMatch) {
                  ws.extractedEmail = emailMatch[0];
                  nextState = 'CONFIRM_EMAIL';
                  const formattedEmail = ws.extractedEmail.replace('@', ' arobase ').replace(/\./g, ' point ');
                  responseText = `D'accord, je note : ${formattedEmail}. C'est bien ça ?`;
                } else if (text.includes('non') || text.includes('plus') || text.includes('annuler') || text.includes('pas besoin')) {
                  nextState = 'REJECTED';
                  responseText = "Pas de soucis, je vous souhaite une excellente journée. Au revoir !";
                } else {
                  // Fallback: try to reconstruct a clean email if there are spaces or spoken separators
                  const simpleEmailPattern = /[a-zA-Z0-9._%+-]+\s*(?:@|arobase)\s*[a-zA-Z0-9.-]+\s*(?:\.|point)\s*[a-zA-Z]{2,}/i;
                  const simpleMatch = text.match(simpleEmailPattern);
                  if (simpleMatch) {
                    let cleanEmail = simpleMatch[0]
                      .replace(/\s+/g, '')
                      .replace(/arobase/gi, '@')
                      .replace(/point/gi, '.');
                    ws.extractedEmail = cleanEmail;
                    nextState = 'CONFIRM_EMAIL';
                    const formattedEmail = ws.extractedEmail.replace('@', ' arobase ').replace(/\./g, ' point ');
                    responseText = `D'accord, je note : ${formattedEmail}. C'est bien ça ?`;
                  } else {
                    nextState = 'email_proposition';
                    responseText = "Je n'ai pas bien saisi l'adresse e-mail. Vous pouvez me la répéter ou l'écrire s'il vous plaît ?";
                  }
                }
              } else if (currentState === 'CONFIRM_EMAIL') {
                if (text.includes('oui') || text.includes('exact') || text.includes('c\'est ça') || text.includes('ouais') || text.includes('bon') || text.includes('ok') || text.includes('ouai') || text.includes('correct') || text.includes('parfait') || text.includes('marche')) {
                  nextState = 'EMAIL_SENT';
                  responseText = `Super, c'est envoyé ! Je vous remercie pour votre temps, passez une excellente journée !`;
                  actionTriggered = { type: 'email_proposition', email: ws.extractedEmail };
                } else if (text.includes('non') || text.includes('pas ça') || text.includes('erreur') || text.includes('tromp') || text.includes('faux') || text.includes('pas du tout')) {
                  nextState = 'email_proposition';
                  responseText = "Ah, excusez-moi. Quelle est la bonne adresse e-mail dans ce cas ?";
                } else {
                  nextState = 'CONFIRM_EMAIL';
                  const formattedEmail = (ws.extractedEmail || '').replace('@', ' arobase ').replace(/\./g, ' point ');
                  responseText = `Est-ce que l'adresse ${formattedEmail} est correcte ? Dites simplement oui ou non.`;
                }
              } else if (currentState === 'EMAIL_SENT') {
                nextState = 'EMAIL_SENT';
                responseText = "L'appel est terminé. Je vous remercie encore et vous souhaite une excellente journée !";
              } else if (currentState === 'INTERESTED') {
                responseText = `C’est noté avec plaisir. M. Marwan vous appellera pour la démo. Merci et bonne fin de journée !`;
                actionTriggered = { type: 'demo', date: '2026-05-22', time: '10:00' };
              } else if (currentState === 'REJECTED') {
                responseText = "L'appel est terminé. Au revoir.";
              }
            }

            currentState = nextState;
            sendState(ws, currentState, responseText, actionTriggered);
          }
        });
      });
  }
}

// Démarrer le serveur HTTP
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SERVEUR COMMENCÉ SUR LE PORT : ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`====================================================`);
});
