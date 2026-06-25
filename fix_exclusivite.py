import re

# ============================================================
# Fix generate_playbook_v2.py
# ============================================================
with open('generate_playbook_v2.py', 'r', encoding='utf-8') as f:
    ppt = f.read()

replacements_ppt = [
    # Sommaire slide 8 description
    (
        '"Effet WoW IA + preuve d\'exclusivit\u00e9 + Stripe closing"',
        '"Effet WoW IA + preuve Google en direct + Stripe closing"'
    ),
    # Pain point slide 3 angle
    (
        "\"Angle d'attaque : \u00ab Chez nous, le client vous appelle vous et vous seul. Z\u00e9ro concurrent sur votre zone. \u00bb\"",
        "\"Angle d'attaque : \u00ab Chez nous, le client voit VOTRE fiche et vous appelle DIRECTEMENT. Z\u00e9ro revente de contact, z\u00e9ro concurrent sur le m\u00eame lead. \u00bb\""
    ),
    # Profil artisan script
    (
        '"\u00ab On a une demande exclusive sur [Ville], dispo 2 min ce soir ? \u00bb"',
        '"\u00ab On a votre profil disponible sur [Ville] — le client vous appelle directement, sans partage de lead. Dispo 2 min ? \u00bb"'
    ),
    # Profil r\u00e9ticent
    (
        '"\u00ab Gainable.fr, c\'est pas une plateforme de leads. C\'est une vitrine exclusive. \u00bb"',
        '"\u00ab Gainable.fr, c\'est pas une plateforme de leads. C\'est une vitrine directe : le client voit VOTRE fiche et vous contacte vous. Z\u00e9ro revente. \u00bb"'
    ),
    # Script accroche g\u00e9rant
    (
        '"\u00ab Je serai rapide. On g\u00e8re un r\u00e9seau d\'installateurs CVC partenaires exclusifs. \u00bb"',
        '"\u00ab Je serai rapide. On publie votre fiche sur Gainable.fr : le client vous trouve et vous appelle directement, sans interm\u00e9diaire. \u00bb"'
    ),
    # Instagram DM relance
    (
        '"\u00ab Salut [Pr\u00e9nom], je voulais valider ton int\u00e9r\u00eat pour la zone [Ville] avant de la lib\u00e9rer pour tes confr\u00e8res. \u00bb"',
        '"\u00ab Salut [Pr\u00e9nom], je voulais valider si tu veux que les clients de [Ville] puissent te trouver directement sur Google et t\'appeler sans passer par une plateforme. \u00bb"'
    ),
    (
        "\"L'urgence est r\u00e9elle : l'exclusivit\u00e9 par zone est un vrai argument.\"",
        '"L\'urgence est r\u00e9elle : chaque artisan visible capte les clients que les invisibles perdent."'
    ),
    # LinkedIn approche 2
    (
        '"Approche 2 \u2014 Exclusivit\u00e9 Sectorielle"',
        '"Approche 2 \u2014 Visibilit\u00e9 Directe Sans Interm\u00e9diaire"'
    ),
    (
        '"\u00ab Bonjour [Nom], nous finalisons le r\u00e9f\u00e9rencement exclusif des experts CVC sur [Ville]. Notre mod\u00e8le : un unique installateur par secteur g\u00e9ographique pour lui envoyer toutes nos demandes sans revente multiple. \u00cattes-vous en mesure de prendre de nouveaux chantiers ? \u00bb"',
        '"\u00ab Bonjour [Nom], nous r\u00e9f\u00e9ren\u00e7ons les experts CVC sur [Ville] sur Gainable.fr. Notre mod\u00e8le : le client voit votre fiche et vous contacte directement. Z\u00e9ro revente de contact, z\u00e9ro partage de lead. \u00cattes-vous en mesure de prendre de nouveaux chantiers ? \u00bb"'
    ),
    # Cadence J3 DM
    (
        '"\u00ab Je voulais valider votre int\u00e9r\u00eat pour l\'exclusivit\u00e9 de [Ville] \u00bb"',
        '"\u00ab Je voulais valider si vous souhaitez \u00eatre visible sur [Ville] \u00bb"'
    ),
    (
        '"\u00ab avant de lib\u00e9rer la zone \u00e0 vos confr\u00e8res. \u00bb"',
        '"\u00ab pour que les clients vous trouvent directement — sans passer par une plateforme qui revend vos contacts. \u00bb"'
    ),
    # D\u00e9mo slide — preuve d'exclusivit\u00e9
    (
        '"2:00-3:00"', '"2:00-3:00"'  # keep timing
    ),
    (
        '"Preuve d\'Exclusivit\u00e9"',
        '"Preuve de Visibilit\u00e9 Directe"'
    ),
    (
        '"\u00ab D\u00e8s que vous validez, aucun concurrent ne peut \u00eatre r\u00e9f\u00e9renc\u00e9 sur votre d\u00e9partement. \u00bb"',
        '"\u00ab D\u00e8s que vous validez, votre fiche est en ligne. Le client tape [Ville] gainable, il voit votre profil et vous appelle DIRECTEMENT. Z\u00e9ro revente, z\u00e9ro partage. \u00bb"'
    ),
    (
        '"\u00ab Ces chantiers-l\u00e0, c\'est gr\u00e2ce \u00e0 Gainable.fr. \u00bb"',
        '"\u00ab Ces artisans re\u00e7oivent des appels directs de clients qui les ont choisis. Aucun concurrent n\'a re\u00e7u le m\u00eame contact. \u00bb"'
    ),
    # Closing slide 10 urgence
    (
        '"\u00ab C\'est valable uniquement maintenant, cette zone part d\u00e8s demain. \u00bb"',
        '"\u00ab C\'est valable uniquement maintenant. Chaque jour sans visibilit\u00e9, c\'est des clients qui trouvent vos concurrents avant vous. \u00bb"'
    ),
    # Objection slide 11 "exclusivit\u00e9 absolue"
    (
        '"Vous connaissez le stress de rappeler un client en 3 min avant 4 concurrents et brader vos marges. Chez nous, c\'est l\'exclusivit\u00e9 absolue : le client vous appelle vous seul. Et c\'est sans commission."',
        '"Vous connaissez le stress de rappeler un client en 3 min avant 4 concurrents et brader vos marges. Chez nous, le client VOUS CHOISIT directement sur votre fiche. Il ne voit pas 4 concurrents. Pas de revente de contact. Et 0% commission."'
    ),
    # Comparatif slide 13 — ligne exclusivit\u00e9 g\u00e9o
    (
        '("Exclusivit\u00e9 g\u00e9o.",        "\u2705 1 seul par zone",       "\u274c Multi-artis.", "\u274c Multi-artis.",    "\u274c Multi-artis.",   "\u2705 1 par m\u00e9tier",  "\u274c Multi-artis.")',
        '("0 revente de contact",     "\u2705 Client choisit direct",  "\u2705 Contact direct",  "\u274c Lead revendu x3+",    "\u26a0\ufe0f Variable",      "\u2705 Recommandation",  "\u274c Lead revendu")'
    ),
    # Script urgence finale
    (
        '"\u00ab je lib\u00e8re la zone de [Ville] pour vos confr\u00e8res. \u00bb"',
        '"\u00ab votre profil restera invisible pendant que vos confr\u00e8res captent vos clients sur Google. \u00bb"'
    ),
    # Plan d'attaque Ciblez
    (
        '"Identifiez 50 prospects CVC RGE par semaine sans partenaire exclusif sur leur secteur."',
        '"Identifiez 50 prospects CVC RGE par semaine qui ne sont pas encore visibles sur Gainable.fr."'
    ),
    # Urgence closing script d\u00e9mo
    (
        '"\u00ab J\'ai une derni\u00e8re place sur [Ville] avant de la proposer \u00e0 [Concurrent Connu si possible]. \u00bb"',
        '"\u00ab Chaque jour sans votre profil en ligne, c\'est des clients qui trouvent vos concurrents \u00e0 votre place. \u00bb"'
    ),
    # Accroche g\u00e9rant "place disponible"
    (
        '"\u00ab On a une place disponible sur votre secteur. \u00c7a prend 5 min pour vous montrer. \u00bb"',
        '"\u00ab On peut publier votre profil en ligne en 5 min pour que vos clients vous trouvent directement. \u00bb"'
    ),
    # Tip BNI comparatif
    (
        '"Maîtrisez chaque concurrent pour positionner Gainable.fr sans h\u00e9sitation"',
        '"M\u00eatrisez chaque mod\u00e8le pour positionner Gainable.fr : 0 revente de contact, le client vous choisit."'
    ),
]

for old, new in replacements_ppt:
    if old in ppt:
        ppt = ppt.replace(old, new)
        print(f"[PPT] Fixed: {old[:60]}...")
    else:
        print(f"[PPT] NOT FOUND: {old[:60]}...")

with open('generate_playbook_v2.py', 'w', encoding='utf-8') as f:
    f.write(ppt)

print("\n--- PPT done ---\n")

# ============================================================
# Fix page.tsx playbook
# ============================================================
with open('src/app/commercial/playbook/page.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

replacements_tsx = [
    # Funnel step 3 mention exclusivit\u00e9 zone
    (
        '"Script 45 sec : direct, jargon technique, mention de l\'exclusivit\u00e9 zone"',
        '"Script 45 sec : direct, jargon technique, mention que le client vous appelle directement — z\u00e9ro revente"'
    ),
    # Cadence J3 relance
    (
        '"« Je voulais valider votre int\u00e9r\u00eat pour l\'exclusivit\u00e9 de [Ville] »"',
        '"« Je voulais valider si vous souhaitez que les clients de [Ville] vous trouvent directement »"'
    ),
    (
        '"« avant de lib\u00e9rer la zone \u00e0 vos confr\u00e8res. »"',
        '"« sans passer par une plateforme qui revend leur contact \u00e0 3 concurrents. »"'
    ),
    (
        'tip: "Court = fort. 3 lignes max. L\'urgence de la zone lib\u00e9r\u00e9e est r\u00e9elle et puissante."',
        'tip: "Court = fort. 3 lignes max. L\'urgence est r\u00e9elle : chaque jour sans visibilit\u00e9 = des clients perdus au profit des concurrents."'
    ),
    # D\u00e9mo step 2 exclusivit\u00e9
    (
        '"2-3 min : Preuve d\'exclusivit\u00e9 — Montrez la carte de sa zone"',
        '"2-3 min : Preuve de visibilit\u00e9 — Montrez sa fiche en ligne et comment le client l\'appelle directement"'
    ),
    # Tips conversion
    (
        '"L\'exclusivit\u00e9 : la zone lib\u00e9r\u00e9e est un vrai levier, utilisez-le"',
        '"La diff\u00e9rence cl\u00e9 : 0 revente de contact — le client choisit votre fiche et vous appelle directement"'
    ),
    # Objections \u00e9vitez le mot exclusivit\u00e9 g\u00e9ographique
    (
        'criteria: "Exclusivit\u00e9 g\u00e9ographique"',
        'criteria: "0 Revente de contact"'
    ),
    (
        'gainable: { val: "\u2705 1 seul par zone", good: true }',
        'gainable: { val: "\u2705 Client vous choisit direct", good: true }'
    ),
    (
        'bilik: { val: "\u274c Multi-artisans", good: false },\n                      travaux: { val: "\u274c Multi-artisans", good: false },\n                      selocal: { val: "\u274c Multi-artisans", good: false },\n                      bni: { val: "\u2705 1 par m\u00e9tier / groupe", good: true },\n                      pages: { val: "\u274c Multi-artisans", good: false },',
        'bilik: { val: "\u2705 Contact direct", good: true },\n                      travaux: { val: "\u274c Lead revendu x3+", good: false },\n                      selocal: { val: "\u26a0\ufe0f Variable", good: false },\n                      bni: { val: "\u2705 Recommandation", good: true },\n                      pages: { val: "\u274c Lead revendu", good: false },'
    ),
    # J5 retrait
    (
        '"« je lib\u00e8re la zone de [Ville] pour vos confr\u00e8res. »"',
        '"« votre profil reste invisible pendant que vos confr\u00e8res captent vos clients sur Google. »"'
    ),
    # Scripts t\u00e9l\u00e9phoniques
    (
        '"« Je voulais valider votre int\u00e9r\u00eat pour la zone [Ville] »"',
        '"« Je voulais valider si vous voulez \u00eatre visible sur [Ville] »"'
    ),
    (
        '"« avant de la lib\u00e9rer \u00e0 vos confr\u00e8res. »"',
        '"« pour que les clients vous contactent directement. »"'
    ),
    # Message retrait J5
    (
        '"« je lib\u00e8re la zone de [Ville] »"',
        '"« votre profil reste introuvable sur Google »"'
    ),
]

for old, new in replacements_tsx:
    if old in tsx:
        tsx = tsx.replace(old, new)
        print(f"[TSX] Fixed: {old[:70]}...")
    else:
        print(f"[TSX] NOT FOUND: {old[:70]}...")

with open('src/app/commercial/playbook/page.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx)

print("\n--- TSX done ---")
