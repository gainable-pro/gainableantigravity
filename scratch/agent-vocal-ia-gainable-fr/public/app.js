// State Management
const API_BASE = (window.location.port === '5050') ? '' : 'http://localhost:5050';

let prospects = [];
let blacklist = [];
let stats = {};
let selectedProspect = null;
let activeWs = null;
let callStartTime = null;
let conversationHistory = [];
let recognition = null;
let latestActionTriggered = null;
let waveBarsInterval = null;

let currentAgentConfig = null;
let activeAudio = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupForms();
  setupCSVImport();
  setupDialerSearch();
  setupSpeechRecognition();
  setupAgentSettings();
  
  // Initial Loads
  refreshDashboard();

  // Polling for stats and callbacks (every 10s)
  setInterval(() => {
    fetchStats();
    fetchCallbacks();
  }, 10000);
});

// Refresh all components
function refreshDashboard() {
  fetchProspects();
  fetchBlacklist();
  fetchStats();
  fetchCalls();
  fetchCallbacks();
}

// Navigation Tabs
function setupTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.tab-panel');
  const title = document.getElementById('main-panel-title');
  const desc = document.getElementById('main-panel-desc');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      
      // Update sidebar state
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update panel visibility
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');

      // Update Page Headers
      if (tabId === 'tab-prospects') {
        title.textContent = "Prospects et Fichiers CVC";
        desc.textContent = "Gérer la liste de prospection sortante et les nouveaux imports de leads";
      } else if (tabId === 'tab-dialer') {
        title.textContent = "AI Call Sandbox";
        desc.textContent = "Simuler et tester des appels commerciaux avec l'agent Valentin";
      } else if (tabId === 'tab-callbacks') {
        title.textContent = "Relances & Blacklist";
        desc.textContent = "Suivre les relances planifiées de Marwan et les numéros exclus (RGPD)";
      } else if (tabId === 'tab-analytics') {
        title.textContent = "Historique et Analyses";
        desc.textContent = "Analyser les statistiques de conversion, durée d'appels et sentiments";
      } else if (tabId === 'tab-settings') {
        title.textContent = "Configuration Valentin";
        desc.textContent = "Personnaliser le prompt système, les objections de Valentin et les voix premium";
      }
    });
  });
}

// REST API Calls
async function fetchProspects() {
  try {
    const res = await fetch(`${API_BASE}/api/prospects`);
    prospects = await res.json();
    renderProspectsTable();
    renderDialerList();
  } catch (err) {
    console.error("Erreur chargement prospects :", err);
  }
}

async function fetchBlacklist() {
  try {
    const res = await fetch(`${API_BASE}/api/blacklist`);
    blacklist = await res.json();
    renderBlacklistTable();
  } catch (err) {
    console.error("Erreur blacklist :", err);
  }
}

async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    stats = await res.json();
    document.getElementById('stat-prospects').textContent = stats.prospectsCount;
    document.getElementById('stat-calls').textContent = stats.callsCount;
    document.getElementById('stat-demos').textContent = stats.demosCount;
    document.getElementById('stat-callbacks').textContent = stats.callbacksCount;
  } catch (err) {
    console.error("Erreur stats :", err);
  }
}

async function fetchCalls() {
  try {
    const res = await fetch(`${API_BASE}/api/calls`);
    const calls = await res.json();
    renderCallsTable(calls);
  } catch (err) {
    console.error("Erreur historique appels :", err);
  }
}

async function fetchCallbacks() {
  try {
    const res = await fetch(`${API_BASE}/api/callbacks`);
    const callbacks = await res.json();
    renderCallbacksTable(callbacks);
  } catch (err) {
    console.error("Erreur callbacks :", err);
  }
}

// Renderers
function renderProspectsTable() {
  const tbody = document.getElementById('prospects-table-body');
  tbody.innerHTML = '';

  if (prospects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">Aucun prospect disponible. Ajoutez-en un ou importez un CSV.</td></tr>`;
    return;
  }

  prospects.forEach(p => {
    const tr = document.createElement('tr');
    
    // Formatting Score badge
    let scoreClass = 'score-low';
    if (p.pre_call_score >= 80) scoreClass = 'score-high';
    else if (p.pre_call_score >= 50) scoreClass = 'score-med';

    const scoreBadge = `<span class="score-badge ${scoreClass}">${p.pre_call_score}/100</span>`;
    const statusBadge = `<span class="status-badge status-${p.status}">${p.status === 'pending' ? 'en attente' : p.status}</span>`;
    const keywordsStr = p.keywords_matched && p.keywords_matched.length > 0 
      ? p.keywords_matched.map(k => `#${k}`).join(' ') 
      : 'climatisation';

    tr.innerHTML = `
      <td>
        <strong style="color: #fff;">${p.name}</strong><br>
        <span style="font-size:12px; color:var(--text-secondary);">${p.phone}</span>
      </td>
      <td>${p.city || 'N/A'}</td>
      <td style="color: var(--gold-primary); font-size:12px;">${keywordsStr}</td>
      <td>${scoreBadge}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-primary" onclick="selectAndDialProspect('${p.id}')" style="padding: 6px 12px; font-size: 12px; display: inline-flex;">
          <i class="fa-solid fa-phone"></i>
        </button>
        <button class="btn btn-danger" onclick="deleteProspect('${p.id}')" style="padding: 6px 12px; font-size: 12px; display: inline-flex; margin-left:5px;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDialerList() {
  const container = document.getElementById('dialer-prospects-list');
  container.innerHTML = '';

  if (prospects.length === 0) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Aucun prospect en attente.</p>`;
    return;
  }

  // Filter out already blacklisted
  const activeProspects = prospects.filter(p => p.status !== 'blacklisted');

  activeProspects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'prospect-list-item';
    if (selectedProspect && selectedProspect.id === p.id) {
      item.classList.add('selected');
    }

    let scoreClass = 'score-low';
    if (p.pre_call_score >= 80) scoreClass = 'score-high';
    else if (p.pre_call_score >= 50) scoreClass = 'score-med';

    item.innerHTML = `
      <div class="prospect-info">
        <h4>${p.name}</h4>
        <p><i class="fa-solid fa-location-dot"></i> ${p.city || 'France'} • ${p.activity_detected || 'Climatisation'}</p>
      </div>
      <div>
        <span class="score-badge ${scoreClass}">${p.pre_call_score}</span>
      </div>
    `;
    item.addEventListener('click', () => selectProspect(p));
    container.appendChild(item);
  });
}

function renderBlacklistTable() {
  const tbody = document.getElementById('blacklist-table-body');
  tbody.innerHTML = '';
  if (blacklist.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">Aucun numéro bloqué.</td></tr>`;
    return;
  }
  blacklist.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${b.phone}</strong></td>
      <td style="color: var(--text-secondary); font-size: 13px;">${b.reason || 'Conformité RGPD'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCallsTable(calls) {
  const tbody = document.getElementById('calls-table-body');
  tbody.innerHTML = '';
  if (!calls || calls.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">Aucun appel répertorié.</td></tr>`;
    return;
  }
  calls.forEach(c => {
    const tr = document.createElement('tr');
    const name = c.prospects ? c.prospects.name : 'Prospect Supprimé';
    const city = c.prospects ? c.prospects.city : '';
    
    let sentimentColor = 'var(--text-secondary)';
    if (c.sentiment === 'Positif') sentimentColor = 'var(--success)';
    else if (c.sentiment === 'Négatif') sentimentColor = 'var(--error)';

    let interestStars = '';
    for(let i=1; i<=5; i++) {
      interestStars += `<i class="fa-solid fa-star" style="color: ${i <= c.interest_score ? 'var(--gold-primary)' : '#222b37'}; font-size:11px;"></i>`;
    }

    const durationMin = Math.floor(c.duration / 60);
    const durationSec = c.duration % 60;
    const durationStr = `${durationMin}m ${durationSec}s`;

    tr.innerHTML = `
      <td>
        <strong>${name}</strong><br>
        <span style="font-size:12px; color:var(--text-secondary);">${city}</span>
      </td>
      <td>${durationStr}</td>
      <td style="color: ${sentimentColor}; font-weight: 700;">${c.sentiment || 'Neutre'}</td>
      <td>${interestStars}</td>
      <td>${c.emotion_detected || 'Calme'}</td>
      <td><span class="status-badge status-${c.conversion_status}">${c.conversion_status}</span></td>
      <td style="font-size: 12px; max-width: 250px; color: var(--text-secondary); line-height: 1.3;">
        ${c.summary || 'N/A'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCallbacksTable(callbacks) {
  const tbody = document.getElementById('callbacks-table-body');
  tbody.innerHTML = '';
  if (!callbacks || callbacks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">Aucun rappel en attente.</td></tr>`;
    return;
  }
  callbacks.forEach(cb => {
    const tr = document.createElement('tr');
    
    // Extract prospect name
    const prospectName = cb.calls && cb.calls.prospects ? cb.calls.prospects.name : 'Inconnu';
    const phone = cb.calls && cb.calls.prospects ? cb.calls.prospects.phone : 'Inconnu';

    const scheduledDate = new Date(cb.scheduled_at);
    const dateStr = scheduledDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    let statusStyle = 'color: var(--text-secondary);';
    if (cb.status === 'pending') statusStyle = 'color: #0284c7; font-weight: bold;';
    else if (cb.status === 'sent') statusStyle = 'color: var(--success);';

    tr.innerHTML = `
      <td><strong>${prospectName}</strong></td>
      <td>${phone}</td>
      <td><strong style="color: #fff;">${dateStr}</strong></td>
      <td style="${statusStyle}">${cb.status.toUpperCase()}</td>
      <td style="font-size:12px; color: var(--text-secondary);">${cb.payload?.reason || 'Rappel commercial'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Select prospect
function selectProspect(prospect) {
  selectedProspect = prospect;
  
  // Highlight in list
  const items = document.querySelectorAll('.prospect-list-item');
  items.forEach(i => i.classList.remove('selected'));
  renderDialerList(); // Redraws and adds class 'selected' to the active item

  // Enable Call button
  const startBtn = document.getElementById('btn-start-call');
  startBtn.removeAttribute('disabled');

  // Load Console Info
  document.getElementById('active-call-name').textContent = prospect.name;
  document.getElementById('active-call-sub').textContent = `Prêt pour l'appel de prospection • ${prospect.phone}`;
  document.getElementById('active-call-state-badge').className = 'status-badge status-pending';
  document.getElementById('active-call-state-badge').textContent = 'PRÊT';

  // Details
  document.getElementById('details-city').textContent = prospect.city || 'N/A';
  document.getElementById('details-rating').textContent = prospect.google_rating ? `${prospect.google_rating}/5 (${prospect.google_reviews_count} avis)` : 'Pas d\'avis';
  document.getElementById('details-website').textContent = prospect.has_website ? 'Oui' : 'Non';
  document.getElementById('details-score').textContent = `${prospect.pre_call_score}/100`;
  document.getElementById('active-prospect-details').style.display = 'block';

  // Clear Transcript
  document.getElementById('conversation-transcript').innerHTML = '<div class="bubble system">Prêt à appeler.</div>';
}

function selectAndDialProspect(prospectId) {
  const p = prospects.find(item => item.id === prospectId);
  if (p) {
    // Switch to Dialer Tab
    document.querySelector('[data-tab="tab-dialer"]').click();
    selectProspect(p);
    // Auto-trigger simulation start
    setTimeout(() => {
      document.getElementById('btn-start-call').click();
    }, 500);
  }
}

// Dialer Live Audio/Simulation Logic
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      
      // Barge-in: arrêter Valentin dès que l'utilisateur commence à parler
      stopSpeaking();
      
      appendTranscriptBubble('user', text);
      
      // Envoie au serveur
      if (activeWs && activeWs.readyState === WebSocket.OPEN) {
        activeWs.send(JSON.stringify({
          event: 'user_input',
          text: text
        }));
      }
    };

    recognition.onend = () => {
      // Recommencer l'écoute si l'appel est toujours actif
      if (activeWs && activeWs.readyState === WebSocket.OPEN) {
        try {
          recognition.start();
        } catch(e) {}
      }
    };
  }
}

// Start Call
document.getElementById('btn-start-call').addEventListener('click', () => {
  if (!selectedProspect) return;

  // UI state
  document.getElementById('btn-start-call').style.display = 'none';
  document.getElementById('btn-end-call').style.display = 'block';
  document.getElementById('active-call-state-badge').className = 'status-badge status-calling';
  document.getElementById('active-call-state-badge').textContent = 'EN COURS';
  document.getElementById('simulation-objection-controls').style.display = 'block';
  document.getElementById('chat-input-container').style.display = 'block';
  document.getElementById('chat-user-input').value = '';

  // Start soundwave animation
  startWaveformAnimation();

  // Clear transcription box
  document.getElementById('conversation-transcript').innerHTML = '';
  appendTranscriptBubble('system', 'Connexion au serveur de voix Valentin...');

  callStartTime = new Date();
  conversationHistory = [];
  latestActionTriggered = null;

  // Websocket
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const wsHost = window.location.port === '5050' ? window.location.host : 'localhost:5050';
  activeWs = new WebSocket(`${protocol}://${wsHost}/simulation-stream?prospectId=${selectedProspect.id}`);

  activeWs.onopen = () => {
    appendTranscriptBubble('system', 'Appel établi. Valentin commence à parler...');
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {}
    }
  };

  activeWs.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.event === 'state_update') {
      appendTranscriptBubble('assistant', data.text);
      speakText(data.text);
      
      // Update badge state
      document.getElementById('active-call-state-badge').textContent = data.state;

      // Check if action triggered
      if (data.action) {
        latestActionTriggered = data.action;
        appendTranscriptBubble('system', `[Action IA déclenchée] Valentin a enregistré : ${data.action.type}`);
      }
    }
    
    if (data.event === 'error') {
      appendTranscriptBubble('system', `Erreur : ${data.text}`);
    }
  };

  activeWs.onclose = () => {
    appendTranscriptBubble('system', 'Appel déconnecté.');
    endCall();
  };
});

// End Call
document.getElementById('btn-end-call').addEventListener('click', () => {
  endCall(true);
});

function endCall(sendEndSignal = false) {
  // Stop Voice Speech
  stopSpeaking();

  // Stop Speech Recognition
  if (recognition) {
    try { recognition.stop(); } catch(e) {}
  }

  // Stop Waveform animation
  stopWaveformAnimation();

  // Close Websocket
  if (activeWs) {
    if (activeWs.readyState === WebSocket.OPEN) {
      activeWs.close();
    }
    activeWs = null;
  }

  // Reset UI buttons
  document.getElementById('btn-start-call').style.display = 'block';
  document.getElementById('btn-end-call').style.display = 'none';
  document.getElementById('simulation-objection-controls').style.display = 'none';
  document.getElementById('chat-input-container').style.display = 'none';
  document.getElementById('active-call-state-badge').className = 'status-badge status-pending';
  document.getElementById('active-call-state-badge').textContent = 'PRÊT';

  // Calculate Duration
  if (callStartTime) {
    const duration = Math.round((new Date() - callStartTime) / 1000);
    callStartTime = null;

    if (sendEndSignal && selectedProspect) {
      const transcriptionText = conversationHistory.map(h => `${h.role === 'assistant' ? 'Valentin' : 'Artisan'}: ${h.text}`).join('\n');
      
      // Deduce final status / outcome
      let convStatus = 'pending';
      if (latestActionTriggered) {
        convStatus = latestActionTriggered.type; // demo, blacklistNumber, email_proposition, etc.
      } else {
        // If conversation contains email or refus
        const dialogue = transcriptionText.toLowerCase();
        if (dialogue.includes('démo') || dialogue.includes('rendez-vous')) convStatus = 'demo';
        else if (dialogue.includes('e-mail') || dialogue.includes('proposition') || dialogue.includes('adresse')) convStatus = 'email_proposition';
        else if (dialogue.includes('blacklist') || dialogue.includes('bannir') || dialogue.includes('supprimez')) convStatus = 'blacklistNumber';
        else if (dialogue.includes('non') || dialogue.includes('pas intéressé') || dialogue.includes('raccrocher')) convStatus = 'refus';
      }

      // Send Post-Call analysis signal to server
      appendTranscriptBubble('system', 'Appel terminé. Enregistrement en base de données...');
      
      fetch(`${API_BASE}/api/simulate-call-end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospectId: selectedProspect.id,
          duration: duration,
          status: 'answered',
          transcription: transcriptionText,
          conversionStatus: convStatus === 'blacklistNumber' ? 'refus' : convStatus,
          followUpDetails: latestActionTriggered
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Analyse enregistrée :", data);
        refreshDashboard();
      })
      .catch(err => console.error("Erreur post-call :", err));
    }
  }
}

// Append Chat Transcript Bubbles
function appendTranscriptBubble(role, text) {
  const container = document.getElementById('conversation-transcript');
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;

  // Add to local logs
  if (role !== 'system') {
    conversationHistory.push({ role, text });
  }
}

// Stop any active speaking (barge-in)
function stopSpeaking() {
  window.speechSynthesis.cancel();
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (err) {
      console.error("[TTS] Erreur d'arrêt audio :", err);
    }
    activeAudio = null;
  }
}

// Text to Speech wrapper supporting Premium TTS Engines
async function speakText(text) {
  stopSpeaking(); // Mute anything currently speaking

  const engine = localStorage.getItem('voice-engine') || 'browser';
  
  if (engine === 'openai') {
    const apiKey = localStorage.getItem('openai-key');
    if (!apiKey) {
      appendTranscriptBubble('system', "⚠️ Clé API OpenAI manquante — passage en voix navigateur.");
      speakBrowser(text);
      return;
    }
    const voice = localStorage.getItem('openai-voice') || 'onyx';
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Erreur OpenAI TTS");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      if (activeWs && activeWs.readyState === WebSocket.OPEN) {
        activeAudio = new Audio(audioUrl);
        activeAudio.play();
      }
    } catch (err) {
      console.error("[TTS OpenAI] Erreur :", err);
      appendTranscriptBubble('system', `⚠️ [OpenAI TTS] ${err.message} — passage en voix navigateur.`);
      speakBrowser(text); // Fallback
    }
  } 
  
  else if (engine === 'elevenlabs') {
    const apiKey = localStorage.getItem('elevenlabs-key');
    const voiceId = localStorage.getItem('elevenlabs-voice');
    
    if (!apiKey) {
      appendTranscriptBubble('system', "⚠️ Clé API ElevenLabs manquante — passage en voix navigateur. Configurez-la dans Paramètres Agent.");
      speakBrowser(text);
      return;
    }
    
    if (!voiceId) {
      appendTranscriptBubble('system', "⚠️ Aucune voix ElevenLabs sélectionnée — passage en voix navigateur. Choisissez une voix dans Paramètres Agent.");
      speakBrowser(text);
      return;
    }

    const stability = parseFloat(localStorage.getItem('el-stability') || '0.75');
    const similarity = parseFloat(localStorage.getItem('el-similarity') || '0.85');

    try {
      // Passe par le proxy serveur pour éviter les erreurs CORS
      const response = await fetch(`${API_BASE}/api/elevenlabs/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text: text,
          stability: stability,
          similarity_boost: similarity
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail?.message || err.error || `Erreur HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (activeWs && activeWs.readyState === WebSocket.OPEN) {
        activeAudio = new Audio(audioUrl);
        activeAudio.play();
      }
    } catch (err) {
      console.error("[TTS ElevenLabs] Erreur :", err);
      appendTranscriptBubble('system', `⚠️ [ElevenLabs TTS] ${err.message} — passage en voix navigateur.`);
      speakBrowser(text); // Fallback
    }
  } 
  
  else {
    speakBrowser(text);
  }
}

// Synthèse vocale du navigateur (fonction réutilisable)
function speakBrowser(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  
  const rate = parseFloat(localStorage.getItem('speech-rate') || '1.15');
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const savedVoiceName = localStorage.getItem('browser-voice');
  if (savedVoiceName) {
    const chosenVoice = voices.find(v => v.name === savedVoiceName);
    if (chosenVoice) utterance.voice = chosenVoice;
  } else {
    const frenchVoice = voices.find(v => v.lang.includes('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;
  }
  
  window.speechSynthesis.speak(utterance);
}


// Objection quick buttons click handler
document.querySelectorAll('.chip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-text');
    
    // Barge-in: arrêter la parole immédiatement lors du clic
    stopSpeaking();
    
    appendTranscriptBubble('user', text);
    
    if (activeWs && activeWs.readyState === WebSocket.OPEN) {
      activeWs.send(JSON.stringify({
        event: 'user_input',
        text: text
      }));
    }
  });
});

// Send typed text chat response to Valentin
function sendChatInput() {
  const input = document.getElementById('chat-user-input');
  const text = input.value.trim();
  if (!text) return;

  // Barge-in: arrêter Valentin dès que l'utilisateur envoie son texte
  stopSpeaking();

  appendTranscriptBubble('user', text);

  if (activeWs && activeWs.readyState === WebSocket.OPEN) {
    activeWs.send(JSON.stringify({
      event: 'user_input',
      text: text
    }));
  }

  input.value = '';
}

// --- GESTIONNAIRE DE PARAMÈTRES ET CONFIGURATION AGENT ---

function setupAgentSettings() {
  loadSavedVoiceSettings();
  loadAgentConfig();

  // Enregistrement de la configuration voix / API
  document.getElementById('voice-settings-form').addEventListener('submit', saveVoiceSettings);

  // Enregistrement du prompt système
  document.getElementById('prompt-settings-form').addEventListener('submit', savePromptSettings);

  // Enregistrement ou modification d'une objection
  document.getElementById('objection-form').addEventListener('submit', saveObjection);

  // Chat input listeners
  document.getElementById('btn-send-chat').addEventListener('click', sendChatInput);
  document.getElementById('chat-user-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatInput();
    }
  });

  // Switch de moteur voix
  document.getElementById('settings-voice-engine').addEventListener('change', (e) => {
    toggleSettingsFields();
    // Si l'utilisateur passe en mode ElevenLabs, charger les voix si une clé est déjà sauvegardée
    if (e.target.value === 'elevenlabs') {
      const savedKey = localStorage.getItem('elevenlabs-key');
      if (savedKey) {
        loadElevenLabsVoices(savedKey);
      }
    }
  });

  // Chargement des voix ElevenLabs sur saisie de la clé (input ET change pour compatibilité navigateur)
  const elKeyInput = document.getElementById('settings-elevenlabs-key');
  elKeyInput.addEventListener('change', (e) => {
    loadElevenLabsVoices(e.target.value.trim());
  });
  elKeyInput.addEventListener('input', (e) => {
    // Déclenche seulement si la clé fait au moins 30 caractères (évite les appels pendant la saisie)
    if (e.target.value.trim().length >= 30) {
      loadElevenLabsVoices(e.target.value.trim());
    }
  });

  // Sliders labels dynamic updates
  document.getElementById('settings-speech-rate').addEventListener('input', (e) => {
    document.getElementById('label-speech-rate').textContent = `Vitesse de lecture : ${e.target.value}x`;
  });
  document.getElementById('settings-el-stability').addEventListener('input', (e) => {
    document.getElementById('label-stability').textContent = `Stabilité : ${Math.round(e.target.value * 100)}%`;
  });
  document.getElementById('settings-el-similarity').addEventListener('input', (e) => {
    document.getElementById('label-similarity').textContent = `Optimisation de la Similitude : ${Math.round(e.target.value * 100)}%`;
  });
}

// Affichage conditionnel des champs de clés API et de sélection de voix
function toggleSettingsFields() {
  const engine = document.getElementById('settings-voice-engine').value;

  // Cacher tous les groupes spécifiques
  document.querySelectorAll('.key-group-openai, .voice-group-openai, .key-group-elevenlabs, .voice-group-elevenlabs, .voice-group-browser').forEach(el => {
    el.style.display = 'none';
  });
  
  // Cacher le sous-groupe ElevenLabs
  document.querySelectorAll('.voice-group-elevenlabs').forEach(el => {
    el.style.display = 'none';
  });

  if (engine === 'browser') {
    document.querySelector('.voice-group-browser').style.display = 'block';
  } else if (engine === 'openai') {
    document.querySelector('.key-group-openai').style.display = 'block';
    document.querySelector('.voice-group-openai').style.display = 'block';
  } else if (engine === 'elevenlabs') {
    document.querySelector('.key-group-elevenlabs').style.display = 'block';
    document.querySelectorAll('.voice-group-elevenlabs').forEach(el => {
      el.style.display = 'block';
    });
  }
}

// Charger les voix locales du navigateur
function loadBrowserVoices() {
  const select = document.getElementById('settings-browser-voice');
  if (!select) return;

  function populate() {
    const voices = window.speechSynthesis.getVoices();
    select.innerHTML = '';

    const frVoices = voices.filter(v => v.lang.includes('fr'));
    const otherVoices = voices.filter(v => !v.lang.includes('fr'));

    frVoices.forEach(voice => {
      const opt = document.createElement('option');
      opt.value = voice.name;
      opt.textContent = `${voice.name} (${voice.lang})`;
      select.appendChild(opt);
    });

    otherVoices.forEach(voice => {
      const opt = document.createElement('option');
      opt.value = voice.name;
      opt.textContent = `${voice.name} (${voice.lang})`;
      select.appendChild(opt);
    });

    const savedVoice = localStorage.getItem('browser-voice');
    if (savedVoice) {
      select.value = savedVoice;
    }
  }

  populate();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populate;
  }
}

// Charger dynamiquement les voix d'ElevenLabs (via proxy serveur pour éviter les CORS)
async function loadElevenLabsVoices(apiKey) {
  const select = document.getElementById('settings-elevenlabs-voice');
  if (!apiKey) {
    select.innerHTML = '<option value="">-- Entrez votre clé API ElevenLabs pour charger les voix --</option>';
    return;
  }
  
  select.innerHTML = '<option value="">⏳ Chargement des voix...</option>';
  try {
    const res = await fetch(`${API_BASE}/api/elevenlabs/voices`, {
      headers: { 'xi-api-key': apiKey }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail?.message || err.error || `Erreur HTTP ${res.status}`);
    }
    const data = await res.json();
    
    select.innerHTML = '';
    if (data.voices && data.voices.length > 0) {
      data.voices.forEach(voice => {
        const opt = document.createElement('option');
        opt.value = voice.voice_id;
        opt.textContent = voice.name;
        select.appendChild(opt);
      });
      const savedElVoice = localStorage.getItem('elevenlabs-voice');
      if (savedElVoice) {
        select.value = savedElVoice;
      }
    } else {
      select.innerHTML = '<option value="">Aucune voix trouvée</option>';
    }
  } catch (err) {
    console.error("[TTS ElevenLabs] Chargement voix échoué :", err);
    select.innerHTML = `<option value="">❌ Erreur : ${err.message}</option>`;
  }
}

// Charger les configurations de voix locales sauvegardées dans le localStorage
function loadSavedVoiceSettings() {
  const engine = localStorage.getItem('voice-engine') || 'browser';
  document.getElementById('settings-voice-engine').value = engine;

  document.getElementById('settings-openai-key').value = localStorage.getItem('openai-key') || '';
  document.getElementById('settings-openai-voice').value = localStorage.getItem('openai-voice') || 'onyx';

  const elKey = localStorage.getItem('elevenlabs-key') || '';
  document.getElementById('settings-elevenlabs-key').value = elKey;

  document.getElementById('settings-speech-rate').value = localStorage.getItem('speech-rate') || '1.15';
  document.getElementById('label-speech-rate').textContent = `Vitesse de lecture : ${document.getElementById('settings-speech-rate').value}x`;

  document.getElementById('settings-el-stability').value = localStorage.getItem('el-stability') || '0.75';
  document.getElementById('label-stability').textContent = `Stabilité : ${Math.round(document.getElementById('settings-el-stability').value * 100)}%`;

  document.getElementById('settings-el-similarity').value = localStorage.getItem('el-similarity') || '0.85';
  document.getElementById('label-similarity').textContent = `Optimisation de la Similitude : ${Math.round(document.getElementById('settings-el-similarity').value * 100)}%`;

  toggleSettingsFields();
  loadBrowserVoices();
  if (elKey) {
    // Léger délai pour s'assurer que le champ 'password' est bien hydraté par le navigateur avant l'appel
    setTimeout(() => loadElevenLabsVoices(elKey), 300);
  }
}

// Enregistrer les paramètres de voix du localStorage
function saveVoiceSettings(e) {
  e.preventDefault();
  const engine = document.getElementById('settings-voice-engine').value;
  localStorage.setItem('voice-engine', engine);

  if (engine === 'openai') {
    localStorage.setItem('openai-key', document.getElementById('settings-openai-key').value.trim());
    localStorage.setItem('openai-voice', document.getElementById('settings-openai-voice').value);
  } else if (engine === 'elevenlabs') {
    localStorage.setItem('elevenlabs-key', document.getElementById('settings-elevenlabs-key').value.trim());
    localStorage.setItem('elevenlabs-voice', document.getElementById('settings-elevenlabs-voice').value);
    localStorage.setItem('el-stability', document.getElementById('settings-el-stability').value);
    localStorage.setItem('el-similarity', document.getElementById('settings-el-similarity').value);
  } else {
    localStorage.setItem('browser-voice', document.getElementById('settings-browser-voice').value);
  }

  localStorage.setItem('speech-rate', document.getElementById('settings-speech-rate').value);
  alert("Paramètres de synthèse vocale enregistrés localement !");
}

// Récupérer le Prompt et les Objections depuis le serveur
async function loadAgentConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/agent-config`);
    if (!res.ok) throw new Error("Erreur serveur lors de la récupération de la configuration");
    currentAgentConfig = await res.json();

    document.getElementById('settings-system-prompt').value = currentAgentConfig.system_prompt;
    renderObjectionsTable();
  } catch (err) {
    console.error("[Settings] Échec chargement config serveur :", err);
  }
}

// Enregistrer le Prompt système sur le serveur
async function savePromptSettings(e) {
  e.preventDefault();
  if (!currentAgentConfig) return;

  currentAgentConfig.system_prompt = document.getElementById('settings-system-prompt').value;

  try {
    const res = await fetch(`${API_BASE}/api/agent-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentAgentConfig)
    });
    if (res.ok) {
      alert("Prompt système enregistré sur le serveur avec succès !");
    } else {
      alert("Erreur lors de l'enregistrement du prompt.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur de connexion réseau.");
  }
}

// Afficher la liste des objections configurées
function renderObjectionsTable() {
  const tbody = document.getElementById('objections-table-body');
  tbody.innerHTML = '';

  if (!currentAgentConfig || !currentAgentConfig.objections || currentAgentConfig.objections.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">Aucune objection configurée.</td></tr>`;
    return;
  }

  currentAgentConfig.objections.forEach(obj => {
    const tr = document.createElement('tr');
    const triggersStr = obj.triggers.map(t => `<span class="score-badge score-low" style="margin-right:4px; font-size:10px; padding:2px 6px;">${t}</span>`).join(' ');

    let actionStr = 'Aucune';
    if (obj.action) {
      actionStr = `<span style="color:var(--gold-primary); font-weight:bold;">${obj.action.type}</span>`;
      if (obj.action.reason) {
        actionStr += `<br><span style="font-size:11px; color:var(--text-secondary);">${obj.action.reason}</span>`;
      }
    }

    tr.innerHTML = `
      <td>
        <strong style="color:#fff;">${obj.title}</strong><br>
        <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:4px;">${triggersStr}</div>
      </td>
      <td style="font-size:12px; max-width:250px; color:var(--text-secondary); line-height:1.3;">${obj.response}</td>
      <td style="font-size:12px;">
        État: <strong style="color:#fff;">${obj.next_state}</strong><br>
        Action: ${actionStr}
      </td>
      <td>
        <button class="btn btn-primary" onclick="editObjection('${obj.id}')" style="padding: 6px 10px; font-size: 11px; display: inline-flex;">
          <i class="fa-solid fa-edit"></i>
        </button>
        <button class="btn btn-danger" onclick="deleteObjection('${obj.id}')" style="padding: 6px 10px; font-size: 11px; display: inline-flex; margin-left:4px;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Ouvrir une objection dans le formulaire d'édition
window.editObjection = function(id) {
  if (!currentAgentConfig || !currentAgentConfig.objections) return;
  const obj = currentAgentConfig.objections.find(o => o.id === id);
  if (!obj) return;

  document.getElementById('obj-id').value = obj.id;
  document.getElementById('obj-title').value = obj.title;
  document.getElementById('obj-triggers').value = obj.triggers.join(', ');
  document.getElementById('obj-response').value = obj.response;
  document.getElementById('obj-next-state').value = obj.next_state;

  if (obj.action) {
    document.getElementById('obj-action-type').value = obj.action.type;
    document.getElementById('obj-action-reason').value = obj.action.reason || '';
    document.getElementById('obj-action-reason-group').style.display = 'block';
  } else {
    document.getElementById('obj-action-type').value = '';
    document.getElementById('obj-action-reason').value = '';
    document.getElementById('obj-action-reason-group').style.display = 'none';
  }

  document.getElementById('obj-form-title').textContent = "Modifier l'objection";
  document.getElementById('btn-submit-obj-text').textContent = "Modifier";
  document.getElementById('btn-cancel-obj-edit').style.display = 'block';
};

// Supprimer une objection
window.deleteObjection = async function(id) {
  if (!currentAgentConfig || !currentAgentConfig.objections) return;
  if (!confirm("Voulez-vous vraiment supprimer cette objection ?")) return;

  currentAgentConfig.objections = currentAgentConfig.objections.filter(o => o.id !== id);

  try {
    const res = await fetch(`${API_BASE}/api/agent-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentAgentConfig)
    });
    if (res.ok) {
      renderObjectionsTable();
      resetObjectionForm();
      alert("Objection supprimée !");
    } else {
      alert("Erreur lors de la suppression de l'objection.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau lors de la suppression.");
  }
};

// Créer ou sauvegarder une objection
async function saveObjection(e) {
  e.preventDefault();
  if (!currentAgentConfig) return;

  const id = document.getElementById('obj-id').value;
  const title = document.getElementById('obj-title').value.trim();
  const triggers = document.getElementById('obj-triggers').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
  const response = document.getElementById('obj-response').value.trim();
  const next_state = document.getElementById('obj-next-state').value;
  const actionType = document.getElementById('obj-action-type').value;
  const actionReason = document.getElementById('obj-action-reason').value.trim();

  let action = null;
  if (actionType) {
    action = { type: actionType };
    if (actionReason) {
      action.reason = actionReason;
    }
  }

  if (id) {
    const idx = currentAgentConfig.objections.findIndex(o => o.id === id);
    if (idx !== -1) {
      currentAgentConfig.objections[idx] = { id, title, triggers, response, next_state, action };
    }
  } else {
    const newId = 'obj_' + Date.now();
    currentAgentConfig.objections.push({ id: newId, title, triggers, response, next_state, action });
  }

  try {
    const res = await fetch(`${API_BASE}/api/agent-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentAgentConfig)
    });
    if (res.ok) {
      renderObjectionsTable();
      resetObjectionForm();
      alert(id ? "Objection mise à jour !" : "Objection ajoutée !");
    } else {
      alert("Erreur lors de l'enregistrement de l'objection.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau.");
  }
}

// Réinitialiser le formulaire d'objection
function resetObjectionForm() {
  document.getElementById('obj-id').value = '';
  document.getElementById('objection-form').reset();
  document.getElementById('obj-action-reason-group').style.display = 'none';
  document.getElementById('obj-form-title').textContent = "Ajouter une objection";
  document.getElementById('btn-submit-obj-text').textContent = "Ajouter";
  document.getElementById('btn-cancel-obj-edit').style.display = 'none';
}

// Logic to clear objection edit cancellation
document.addEventListener('DOMContentLoaded', () => {
  const cancelBtn = document.getElementById('btn-cancel-obj-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetObjectionForm);
  }
  
  const actionSelect = document.getElementById('obj-action-type');
  if (actionSelect) {
    actionSelect.addEventListener('change', (e) => {
      const reasonGroup = document.getElementById('obj-action-reason-group');
      if (e.target.value) {
        reasonGroup.style.display = 'block';
      } else {
        reasonGroup.style.display = 'none';
      }
    });
  }
});

// Soundwave animation triggers
function startWaveformAnimation() {
  const bars = document.querySelectorAll('.wave-bar');
  bars.forEach(b => b.classList.add('active'));

  // Add micro noise variation to heights
  waveBarsInterval = setInterval(() => {
    bars.forEach(bar => {
      const height = Math.floor(Math.random() * 45) + 10;
      bar.style.height = `${height}px`;
    });
  }, 120);
}

function stopWaveformAnimation() {
  if (waveBarsInterval) {
    clearInterval(waveBarsInterval);
    waveBarsInterval = null;
  }
  const bars = document.querySelectorAll('.wave-bar');
  bars.forEach(b => {
    b.classList.remove('active');
    b.style.height = '8px';
  });
}

// Setup Manual Forms
function setupForms() {
  // Add prospect form
  document.getElementById('add-prospect-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('p-name').value;
    const phone = document.getElementById('p-phone').value;
    const email = document.getElementById('p-email').value;
    const city = document.getElementById('p-city').value;
    const activity = document.getElementById('p-activity').value;

    try {
      const res = await fetch(`${API_BASE}/api/prospects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, city, activity })
      });
      if (res.ok) {
        document.getElementById('add-prospect-form').reset();
        refreshDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Blacklist form
  document.getElementById('add-blacklist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('b-phone').value;
    const reason = document.getElementById('b-reason').value;

    try {
      const res = await fetch(`${API_BASE}/api/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, reason })
      });
      if (res.ok) {
        document.getElementById('add-blacklist-form').reset();
        refreshDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Trigger tick button (manually run callback verification)
  document.getElementById('btn-trigger-tick').addEventListener('click', async () => {
    const btn = document.getElementById('btn-trigger-tick');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Traitement...`;
    try {
      const res = await fetch(`${API_BASE}/api/scheduler/tick`);
      if (res.ok) {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Traité !`;
        setTimeout(() => {
          btn.innerHTML = `<i class="fa-solid fa-rotate"></i> Vérifier Rappels`;
        }, 1500);
        refreshDashboard();
      }
    } catch (err) {
      btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Erreur`;
      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-rotate"></i> Vérifier Rappels`;
      }, 1500);
    }
  });
}

// Drag & Drop CSV Importer
function setupCSVImport() {
  const dropzone = document.getElementById('csv-dropzone');
  const fileInput = document.getElementById('csv-file-input');
  const statusDiv = document.getElementById('import-status');

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--gold-primary)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border-color)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    const file = e.dataTransfer.files[0];
    if (file) handleCSVFile(file);
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) handleCSVFile(file);
  });

  function handleCSVFile(file) {
    if (file.name.slice(-4).toLowerCase() !== '.csv') {
      statusDiv.style.color = 'var(--error)';
      statusDiv.textContent = "Seuls les fichiers .csv sont supportés.";
      return;
    }

    statusDiv.style.color = 'var(--gold-primary)';
    statusDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Traitement du fichier CSV...`;

    const mission = document.getElementById('csv-mission').value || 'Import CSV';

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      try {
        const res = await fetch(`${API_BASE}/api/import?mission=${encodeURIComponent(mission)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/csv' },
          body: text
        });
        const data = await res.json();
        
        statusDiv.style.color = 'var(--success)';
        statusDiv.innerHTML = `<strong>Succès !</strong> Importés : ${data.importedCount} | Doublons : ${data.duplicatesCount} | Bloqués : ${data.blacklistedCount}`;
        
        refreshDashboard();
      } catch (err) {
        statusDiv.style.color = 'var(--error)';
        statusDiv.textContent = "Erreur de traitement lors de l'envoi de l'import.";
        console.error(err);
      }
    };
    reader.readAsText(file);
  }
}

// Delete manual prospect
window.deleteProspect = async function(id) {
  if (confirm("Voulez-vous vraiment supprimer cet installateur de la liste ?")) {
    try {
      const res = await fetch(`${API_BASE}/api/prospects/${id}`, { method: 'DELETE' });
      if (res.ok) refreshDashboard();
    } catch(err) {
      console.error(err);
    }
  }
};

// Dialer Search filter
function setupDialerSearch() {
  const searchInput = document.getElementById('search-prospect');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.prospect-list-item');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}
