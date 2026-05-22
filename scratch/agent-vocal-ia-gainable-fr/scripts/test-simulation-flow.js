import WebSocket from 'ws';

const wsUrl = 'ws://localhost:5050/simulation-stream?prospectId=mock-prospect-1';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSimulationTests() {
  console.log("=== COMMENCEMENT DE LA SIMULATION DU FLUX DE DIALOGUE VALENTIN ===");

  await testFlowEmail();
  console.log("\n--------------------------------------------------\n");
  await testFlowObjectionAndDemo();
}

function testFlowEmail() {
  return new Promise((resolve) => {
    console.log("👉 TEST 1 : Flux d'extraction d'e-mail avec prononciation phonétique et clôture");
    const ws = new WebSocket(wsUrl);
    
    let step = 0;

    ws.on('open', () => {
      console.log("[WS] Connecté au simulateur.");
    });

    ws.on('message', async (data) => {
      const msg = JSON.parse(data);
      
      if (msg.event === 'system') {
        console.log(`[SYS] ${msg.text}`);
        return;
      }

      if (msg.event === 'state_update') {
        console.log(`[VALENTIN (${msg.state})] : "${msg.text}"`);
        
        if (msg.action) {
          console.log(`[ACTION DÉCLENCHÉE] :`, msg.action);
        }

        await sleep(1500);

        if (step === 0) {
          // Valentin a dit bonjour (INTRO)
          console.log(`[PROSPECT] : "Oui, c'est moi. Envoyez-moi un e-mail s'il vous plaît"`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Oui c'est moi. Envoyez-moi un e-mail s'il vous plaît" }));
          step++;
        } else if (step === 1) {
          // Valentin demande l'adresse e-mail
          console.log(`[PROSPECT] : "Mon adresse c'est contact@azur-clim.fr"`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Mon adresse c'est contact@azur-clim.fr" }));
          step++;
        } else if (step === 2) {
          // Valentin doit confirmer l'adresse en phonétique ("contact arobase azur point clim point fr" ou similaire)
          console.log(`[PROSPECT] : "Oui, c'est exactement ça."`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Oui c'est exactement ça." }));
          step++;
        } else if (step === 3) {
          // Valentin confirme l'envoi et dit "Excellente journée !"
          console.log("[TEST 1 REUSSI] Fermeture de la connexion.");
          ws.close();
          resolve();
        }
      }
    });

    ws.on('error', (err) => {
      console.error("[WS ERROR]", err.message);
      ws.close();
      resolve();
    });
  });
}

function testFlowObjectionAndDemo() {
  return new Promise((resolve) => {
    console.log("👉 TEST 2 : Flux d'accroche -> pitch -> objection site web -> démo");
    const ws = new WebSocket(wsUrl);
    
    let step = 0;

    ws.on('open', () => {
      console.log("[WS] Connecté au simulateur.");
    });

    ws.on('message', async (data) => {
      const msg = JSON.parse(data);
      
      if (msg.event === 'system') {
        console.log(`[SYS] ${msg.text}`);
        return;
      }

      if (msg.event === 'state_update') {
        console.log(`[VALENTIN (${msg.state})] : "${msg.text}"`);

        if (msg.action) {
          console.log(`[ACTION DÉCLENCHÉE] :`, msg.action);
        }

        await sleep(1500);

        if (step === 0) {
          // Valentin a dit bonjour (INTRO)
          console.log(`[PROSPECT] : "Allô oui ?"`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Allô oui ?" }));
          step++;
        } else if (step === 1) {
          // Valentin accroche (CURIOUS)
          console.log(`[PROSPECT] : "Je fonctionne uniquement par le bouche à oreille"`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Je fonctionne uniquement par le bouche à oreille" }));
          step++;
        } else if (step === 2) {
          // Valentin pitch (PITCHED)
          console.log(`[PROSPECT] : "Mais de toute façon j'ai déjà un site internet !"`);
          ws.send(JSON.stringify({ event: 'user_input', text: "Mais de toute façon j'ai déjà un site internet !" }));
          step++;
        } else if (step === 3) {
          // Valentin traite l'objection "J'ai déjà un site" (DEFENSIVE)
          console.log(`[PROSPECT] : "D'accord, pourquoi pas, montrez-moi comment ça marche."`);
          ws.send(JSON.stringify({ event: 'user_input', text: "D'accord, pourquoi pas, montrez-moi comment ça marche." }));
          step++;
        } else if (step === 4) {
          // Valentin propose la démo (INTERESTED)
          console.log("[TEST 2 REUSSI] Fermeture de la connexion.");
          ws.close();
          resolve();
        }
      }
    });

    ws.on('error', (err) => {
      console.error("[WS ERROR]", err.message);
      ws.close();
      resolve();
    });
  });
}

runSimulationTests().catch(console.error);
