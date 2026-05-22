-- Activer l'extension pgvector pour la recherche vectorielle d'objections (si non active par defaut)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table de blacklist (RGPD / Compliance)
CREATE TABLE IF NOT EXISTS blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table des prospects avec champs de scoring et enrichissement
CREATE TABLE IF NOT EXISTS prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    siret TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT,
    region TEXT,
    activity_detected TEXT, -- climatisation, vrv, pac, diagnostics, etc.
    source TEXT DEFAULT 'import_csv',
    
    -- Enrichissement Google
    google_rating FLOAT,
    google_reviews_count INTEGER,
    has_website BOOLEAN,
    digital_maturity TEXT, -- faible, moyenne, forte
    keywords_matched TEXT[], -- gainable, pac, cvc, etc.
    
    -- Scoring et Campagne
    pre_call_score INTEGER DEFAULT 0,
    mission_name TEXT, -- ex: 'Zone Sud', 'Marseille CVC'
    status TEXT DEFAULT 'pending', -- pending, calling, busy, answered, qualified, refused, blacklisted, callback
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table des appels
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    duration INTEGER,
    status TEXT,
    transcription TEXT,
    summary TEXT,
    sentiment TEXT,
    interest_score INTEGER CHECK (interest_score BETWEEN 1 AND 5),
    emotion_detected TEXT,
    conversion_status TEXT, -- demo, refus, rappel, transfert
    scoring_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table de la memoire vectorielle d'objections
CREATE TABLE IF NOT EXISTS objection_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objection_text TEXT NOT NULL,
    best_response TEXT NOT NULL,
    embedding VECTOR(1536), -- Dimension d'embedding OpenAI standard (text-embedding-3-small)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table des taches de relance (callbacks)
CREATE TABLE IF NOT EXISTS follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- email, callback
    target TEXT, -- email de destination ou date/heure de rappel
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    payload JSONB,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table des suggestions d'apprentissage
CREATE TABLE IF NOT EXISTS objections_learned (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    detected_objection TEXT,
    ai_response TEXT,
    performance_score INTEGER,
    suggested_prompt_update TEXT,
    approved_by_user BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
