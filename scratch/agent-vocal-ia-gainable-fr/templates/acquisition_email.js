/**
 * Template HTML premium et responsive pour les e-mails d'acquisition Gainable.fr.
 * Pitch commercial : Visibilité SEO Locale Exclusive + Générateur d'Articles IA de chantiers.
 */
export function getAcquisitionEmailHtml({ companyName, city }) {
  // Lien de paiement / souscription (simulation d'une page d'inscription payante exclusive)
  const registrationLink = `https://gainable.fr/inscription?prospect=${encodeURIComponent(companyName)}&city=${encodeURIComponent(city)}`;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Développement de votre activité sur ${city} - Gainable.fr</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #0d0f12;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0d0f12;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #12161a;
      border: 1px solid #232931;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #1b222b 0%, #11161d 100%);
      padding: 30px 40px;
      text-align: center;
      border-bottom: 2px solid #c5a880;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 1px;
      text-decoration: none;
    }
    .logo span {
      color: #c5a880;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    h1 {
      color: #ffffff;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 700;
    }
    p {
      color: #cbd5e1;
      font-size: 15px;
      margin-bottom: 20px;
    }
    .highlight-box {
      background-color: #1a2027;
      border-left: 4px solid #c5a880;
      padding: 20px;
      margin: 30px 0;
      border-radius: 0 8px 8px 0;
    }
    .highlight-box h3 {
      margin-top: 0;
      color: #ffffff;
      font-size: 16px;
    }
    .highlight-box ul {
      margin: 0;
      padding-left: 20px;
      color: #cbd5e1;
      font-size: 14px;
    }
    .highlight-box li {
      margin-bottom: 8px;
    }
    .cta-container {
      text-align: center;
      margin: 35px 0 15px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #c5a880 0%, #a3875d 100%);
      color: #0b0d0f !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 15px 35px;
      border-radius: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(197, 168, 128, 0.3);
    }
    .footer {
      background-color: #0b0d0f;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #1a2027;
    }
    .footer p {
      color: #64748b;
      font-size: 12px;
      margin: 5px 0;
    }
    .footer a {
      color: #c5a880;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://gainable.fr" class="logo">GAINABLE<span>.fr</span></a>
      </div>
      <div class="content">
        <h1>Bonjour l'équipe ${companyName},</h1>
        
        <p>Suite à notre échange téléphonique concernant votre activité sur <strong>${city}</strong>, je vous transmets les détails de notre offre exclusive.</p>
        
        <p>Contrairement aux plateformes classiques de mise en relation qui revendent les mêmes fiches clients à 3 ou 4 installateurs différents (provoquant une guerre des prix agressive), <strong>Gainable.fr</strong> vous garantit l'<strong>exclusivité locale</strong> de votre secteur.</p>
        
        <div class="highlight-box">
          <h3>La puissance de notre solution :</h3>
          <ul>
            <li><strong>Zéro concurrence partagée :</strong> Les clients qui vous trouvent sur Gainable.fr vous appellent en direct. Pas de devis en concurrence.</li>
            <li><strong>L'Intelligence Artificielle de Chantier :</strong> En fin de chantier, votre technicien prend 2 minutes pour saisir sur son mobile le titre des travaux (ex: "Installation Clim Gainable Daikin") et la ville. Notre IA génère en 1 minute un article SEO de qualité professionnelle.</li>
            <li><strong>Visibilité Immédiate :</strong> L'article rédigé est instantanément indexé sur Google et positionne votre entreprise sur des requêtes locales très recherchées.</li>
            <li><strong>Trafic en direct :</strong> Vous recevez des appels qualifiés directement sur votre ligne, sans intermédiaire et sans commission.</li>
          </ul>
        </div>
        
        <p>Nous limitons volontairement le nombre d'installateurs partenaires par secteur pour maintenir une exclusivité totale et un retour sur investissement optimal. Votre secteur sur <strong>${city}</strong> est actuellement disponible.</p>
        
        <div class="cta-container">
          <a href="${registrationLink}" class="cta-button">Activer mon secteur exclusif sur ${city}</a>
        </div>
        
        <p style="font-size: 13px; text-align: center; color: #64748b; margin-top: 25px;">
          <em>Offre réservée aux professionnels qualifiés RGE / Climatisation de la région de ${city}.</em>
        </p>
      </div>
      
      <div class="footer">
        <p>Ce message vous a été envoyé par Valentin, assistant virtuel de Gainable.fr.</p>
        <p>© 2026 Gainable.fr. Tous droits réservés.</p>
        <p><a href="https://gainable.fr/mentions-legales">Mentions Légales</a> | <a href="https://gainable.fr/contact">Contact</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
