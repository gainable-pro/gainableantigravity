import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || 
                      supabaseUrl.includes('your-project') || 
                      supabaseUrl.includes('placeholder') || 
                      !supabaseAnonKey || 
                      supabaseAnonKey.includes('your_anon_public_key');

let client;

// Base de données simulée en mémoire pour les tests et démonstrations locales
const memoryDb = {
  prospects: [],
  calls: [],
  blacklist: [],
  follow_ups: [],
  objections_learned: [],
  objection_vectors: []
};

if (isPlaceholder) {
  console.log("ℹ️ Mode Démo : Utilisation de la base de données locale en mémoire (Mock Supabase).");
  
  try {
    const possiblePaths = [
      path.join(process.cwd(), '..', 'cvc_data.xlsx'),
      path.join(process.cwd(), 'cvc_data.xlsx'),
      'C:\\Users\\ghari\\.gemini\\antigravity-ide\\scratch\\cvc_data.xlsx'
    ];
    let excelPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        excelPath = p;
        break;
      }
    }

    if (excelPath) {
      console.log(`📊 Mode Démo : Chargement des prospects depuis ${excelPath}`);
      const workbook = XLSX.readFile(excelPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      let count = 0;
      for (const row of rows) {
        if (count >= 100) break;

        const rawPhone = row['Téléphone'];
        if (!rawPhone) continue;

        let phone = String(rawPhone).trim().replace(/[\s\.\-\(\)]/g, '');
        if (phone.startsWith('0')) {
          phone = '+33' + phone.substring(1);
        }

        const name = row['Raison sociale'] || 'Sans Nom';
        const city = row['Ville'] || 'France';
        const activity = row['Métier'] || row['Libellé activité'] || 'climatisation';
        const zipCode = row['Code postal'] ? String(row['Code postal']) : '';
        const region = row['Région'] || '';
        const address = row['Adresse normée ligne 4'] || '';
        const siret = row['Siret'] ? String(row['Siret']) : '';

        // Déterminer le score pré-appel
        const actLower = activity.toLowerCase();
        const isHigh = actLower.includes('clim') || actLower.includes('pac') || actLower.includes('thermique') || actLower.includes('chauffage');
        const score = isHigh ? 85 : 60;

        // Générer des métadonnées de simulation réalistes
        const googleRating = parseFloat((Math.random() * 0.8 + 4.0).toFixed(1));
        const googleReviews = Math.floor(Math.random() * 40) + 5;
        const hasWebsite = Math.random() > 0.4;

        memoryDb.prospects.push({
          id: `mock-prospect-${count + 1}`,
          name,
          siret,
          phone,
          email: null,
          website: hasWebsite ? `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'installateur'}.fr` : null,
          address,
          city,
          zip_code: zipCode,
          region,
          activity_detected: activity,
          source: 'import_excel_cvc',
          google_rating: googleRating,
          google_reviews_count: googleReviews,
          has_website: hasWebsite,
          digital_maturity: hasWebsite ? (googleReviews > 20 ? 'forte' : 'moyenne') : 'faible',
          keywords_matched: isHigh ? ['clim', 'pac'] : [],
          pre_call_score: score,
          mission_name: 'Import CVC Excel',
          status: 'pending',
          created_at: new Date().toISOString()
        });
        count++;
      }
      console.log(`✅ Loaded ${memoryDb.prospects.length} prospects from Excel in memory.`);
    } else {
      console.log("⚠️ Fichier cvc_data.xlsx introuvable, utilisation de prospects de démonstration par défaut.");
      memoryDb.prospects = [
        {
          id: 'demo-1',
          name: 'Clim’Azur',
          phone: '+33612345678',
          email: null,
          city: 'Marseille',
          activity_detected: 'Installation de climatisation',
          google_rating: 4.8,
          google_reviews_count: 24,
          has_website: true,
          pre_call_score: 85,
          status: 'pending'
        },
        {
          id: 'demo-2',
          name: 'Thermi-Concept',
          phone: '+33687654321',
          email: null,
          city: 'Lyon',
          activity_detected: 'Pompes à chaleur',
          google_rating: 4.2,
          google_reviews_count: 12,
          has_website: false,
          pre_call_score: 85,
          status: 'pending'
        }
      ];
    }
  } catch (err) {
    console.error("❌ Erreur lors du chargement de l'excel au démarrage :", err);
  }

  class MockQueryBuilder {
    constructor(tableName) {
      this.tableName = tableName;
      this.data = memoryDb[tableName] || [];
      this.filterCol = null;
      this.filterVal = null;
      this.lteCol = null;
      this.lteVal = null;
      this.isSingle = false;
      this.isMaybeSingle = false;
      this.isDelete = false;
      this.insertedData = null;
      this.updateFields = null;
      this.selectOptions = null;
    }

    select(fields = '*', options = {}) {
      this.selectOptions = options;
      return this;
    }

    insert(records) {
      const arr = Array.isArray(records) ? records : [records];
      const inserted = arr.map(r => {
        const newRec = {
          id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
          ...r
        };
        this.data.push(newRec);
        return newRec;
      });
      this.insertedData = inserted;
      return this;
    }

    update(fields) {
      this.updateFields = fields;
      return this;
    }

    delete() {
      this.isDelete = true;
      return this;
    }

    order(column, { ascending = true } = {}) {
      // Tri en mémoire par date ou score
      this.data.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (typeof valA === 'string') return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        return ascending ? valA - valB : valB - valA;
      });
      return this;
    }

    eq(column, value) {
      this.filterCol = column;
      this.filterVal = value;
      return this;
    }

    lte(column, value) {
      this.lteCol = column;
      this.lteVal = value;
      return this;
    }

    single() {
      this.isSingle = true;
      return this.then();
    }

    maybeSingle() {
      this.isMaybeSingle = true;
      return this.then();
    }

    // Résolution chaînée compatible avec async/await
    async then(onfulfilled) {
      let result = [...this.data];

      // Filtre égalité (ex: eq('phone', '+33413414901'))
      if (this.filterCol) {
        result = result.filter(item => item[this.filterCol] === this.filterVal);
      }

      // Filtre inférieur ou égal (ex: lte('scheduled_at', now))
      if (this.lteCol) {
        result = result.filter(item => new Date(item[this.lteCol]) <= new Date(this.lteVal));
      }

      // Mises à jour
      if (this.updateFields) {
        result.forEach(item => {
          Object.assign(item, this.updateFields);
        });
      }

      // Suppressions
      if (this.isDelete) {
        const idsToDelete = result.map(r => r.id);
        memoryDb[this.tableName] = this.data.filter(item => !idsToDelete.includes(item.id));
        result = { success: true };
      }

      let response = { data: null, error: null, count: 0 };

      if (this.insertedData) {
        response.data = this.isSingle ? this.insertedData[0] : this.insertedData;
      } else if (this.isDelete) {
        response.data = result;
      } else {
        // Résolution des jointures virtuelles
        let resolvedResult = result.map(item => {
          const copy = { ...item };
          if (this.tableName === 'calls') {
            copy.prospects = memoryDb.prospects.find(p => p.id === item.prospect_id) || null;
          }
          if (this.tableName === 'follow_ups') {
            const call = memoryDb.calls.find(c => c.id === item.call_id);
            if (call) {
              const copyCall = { ...call };
              copyCall.prospects = memoryDb.prospects.find(p => p.id === call.prospect_id) || null;
              copy.calls = copyCall;
            }
          }
          return copy;
        });

        if (this.isSingle) {
          response.data = resolvedResult[0] || null;
          if (!response.data) {
            response.error = { message: "Aucun élément trouvé." };
          }
        } else if (this.isMaybeSingle) {
          response.data = resolvedResult[0] || null;
        } else {
          response.data = resolvedResult;
        }
      }

      if (this.selectOptions && this.selectOptions.count === 'exact') {
        response.count = result.length;
      }

      if (onfulfilled) {
        return onfulfilled(response);
      }
      return response;
    }
  }

  client = {
    from: (tableName) => new MockQueryBuilder(tableName)
  };

} else {
  console.log("✅ Mode Cloud : Connexion à l'instance Supabase active.");
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
export const isMockActive = isPlaceholder;
