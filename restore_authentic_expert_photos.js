require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const STORAGE_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gainable-assets/uploads/`;

// Mapping of Expert slug -> array of Supabase Storage filenames belonging strictly to this expert
const AUTHENTIC_EXPERT_PHOTOS = {
  // AIR G ENERGIE
  'climatisation-pompe-a-chaleur-miramas-air-g-energie-8907': [
    '1768123412109_vmpka1afn_2023-02-25__2_.webp',
    '1768123412109_xebtyjxok_unnamed__8_.webp',
    '1768123412109_0gtx702hd_2023-02-25__3_.webp',
    '1768123412109_3vhlf3y5j_2023-11-15.webp'
  ],

  // A.C.E.S.
  'climatisation-pompe-a-chaleur-portet-sur-garonne-a-c-e-s-a-c-e-s-4609': [
    '1767424809101_frt3s4y4c_cropped-Hemodia-1_VRF_chantier_ACES.webp',
    '1767424812256_7vtu24cyr_Chantier-VRF-Hopital-Joseph-Ducuing-Toulouse_ACES-Climatisation.webp',
    '1767424819168_l2ilbgnsf_cropped-BTPMP-4_VRF_chantier_ACES.webp'
  ],

  // SOLAIRE CLIM CHAUFFAGE (LOIRE CLIM CHAUFFAGE)
  'climatisation-pompe-a-chaleur-veauche-solaire-clim-chauffage-loire-clim-chauffage-3829': [
    '1767426314488_f4jcnzh4v_119046677_3166659576795175_1593957584366480080_n.webp',
    '1767426318678_q043fmkd9_119033649_977863502734194_1866573199788957436_n.webp'
  ],

  // ENERGIES RENOUVELABLES BISONTINES (MACLEM)
  'climatisation-pompe-a-chaleur-avanne-aveney-energies-renouvelables-bisontines-maclem-8165': [
    '1767999320447_47675db87_1000037645.webp',
    '1767999320447_4facre1v9_1000037651.webp',
    '1767999320447_6lo0f9nxp_1000037653.webp',
    '1767999320447_80k8jz5l3_1000037646.webp',
    '1767999320447_88tf0lcf6_1000037652.webp',
    '1767999320447_89r35y67a_1000037648.webp',
    '1767999320447_ai5io0u3l_1000037654.webp',
    '1767999320447_ipp5vmf00_1000037650.webp',
    '1767999320447_ro4tf1zyi_1000037647.webp',
    '1767999320447_txj3eqfrx_1000037656.webp',
    '1767999320447_ukoac8cif_1000037649.webp',
    '1767999320447_vwcucis75_1000037655.webp',
    '1767999320448_v7fy5v61w_1000037642.webp'
  ],

  // PROFECLIM
  'climatisation-pompe-a-chaleur-rouen-profeclim-7713': [
    '1768127414245_3ivz86n5e_IMG_20251224_112522.jpg',
    '1768127414245_4h0o6ea8y_IMG_20251224_121317.jpg',
    '1768127414245_6rubkrtly_IMG_20240730_174429.jpg',
    '1768127414245_77s1um9vi_IMG_20250915_122127.jpg',
    '1768127414245_9z5hmxp2d_IMG_20241106_175412.jpg',
    '1768127414245_a8uwos7n7_IMG_20240826_125513.jpg',
    '1768127414245_co9646dar_IMG_20240919_140742.jpg',
    '1768127414245_ff4kr7wr9_IMG_20240704_135722.jpg',
    '1768127414245_hi7t61asl_IMG_20240919_154958.jpg',
    '1768127414245_hqwgrpuch_IMG_20240919_155023.jpg',
    '1768127414245_nv43ljl78_IMG_20251224_114013.jpg',
    '1768127414245_q5c4hsdie_IMG_20251224_113102.jpg',
    '1768127414245_wio4onz9y_IMG_20240704_143420.jpg',
    '1768127414245_wpbvljcd6_IMG_20240917_102812.jpg',
    '1768127414245_x2nozfty7_IMG_20250915_122120.jpg',
    '1768127414245_xknus4w7k_IMG_20240826_122321.jpg'
  ],

  // PLOMBERIE SERVICES 91
  'climatisation-pompe-a-chaleur-oison-plomberie-services-91-8935': [
    '1768540615441_iikoz8nkt_20180314_122651__2_.webp',
    '1768540615441_mc2miahl8_IMG-20210401-162250_8166_xxl.webp'
  ],

  // AERY (AERY)
  'climatisation-pompe-a-chaleur-sainte-luce-sur-loire-aery-aery-8246': [
    '1768811007371_mret95k5e_20230825_102503-768x1024.jpg',
    '1768811007372_3vz54fsic_2025-10-21.webp',
    '1768811007372_5laml8ma0_2021-01-21.webp',
    '1768811007372_6ubt42tnz_unnamed__9_.webp',
    '1768811007372_8urf05f49_2025-10-21__1_.webp',
    '1768811007372_95y9zeeth_2022-09-25.webp',
    '1768811007372_cc11pegwp_2021-06-21.webp',
    '1768811007372_owybefr1g_20230727_163328-2.jpg',
    '1768811007372_ox23zjliz_2022-09-09.webp',
    '1768811007372_qy77endbk_unnamed__10_.webp',
    '1768811537025_h0cukjwl6_unnamed__11_.webp',
    '1768811537025_idm21pu9y_2025-08-06.webp',
    '1768811537025_in641zsae_2025-05-14.webp',
    '1768811537025_q4448vek4_2024-01-31.webp',
    '1768811537025_rqd9ptepp_2024-08-15.webp',
    '1768811537025_syu6jf3s4_2025-02-12.webp',
    '1768811537025_tzgsenv2p_2024-08-05.webp'
  ],

  // LORRAINE CHAUFFAGE
  'climatisation-pompe-a-chaleur-vaux-lorraine-chauffage-6298': [
    '1768812595674_6lox8mdq7_2025-08-04.webp',
    '1768812595674_dufzt8egf_lorrraine-chauffage-installation-pompe-chaleur-mitsubishi.webp',
    '1768812595674_h9gh4h61n_2023-05-31.webp',
    '1768812595674_in2gebdg9_unnamed__12_.webp',
    '1768812595674_ntylufihw_2025-08-04__1_.webp',
    '1768812595674_zkvov58o3_lorraine_chauffage_climatisation2.webp'
  ],

  // LRC CLIMATISATION
  'climatisation-pompe-a-chaleur-rosieres-pres-troyes-lrc-climatisation-9781': [
    '1768813079862_c2gosrnxp_unnamed__22_.webp',
    '1768813079862_cgorenl3k_unnamed__21_.webp',
    '1768813079862_p089y4luf_unnamed__23_.webp',
    '1768813079862_pkkae8j8k_unnamed__24_.webp',
    '1768813079862_s0556t5g6_unnamed__20_.webp',
    '1768813079862_uc6x1try2_unnamed__18_.webp',
    '1768813079862_vf61b6lu3_unnamed__19_.webp',
    '1768813079863_2bcqfjvy5_5FE33890-5416-4FEB-949B-B3F1DD27CD14.webp',
    '1768813079863_c6s0jlqae_unnamed__16_.webp',
    '1768813079863_cg5gxt624_unnamed__17_.webp',
    '1768813079863_e47dbs671_unnamed__14_.webp',
    '1768813079863_f3c3ot79c_unnamed__15_.webp',
    '1768813079863_h94tih6fy_unnamed__13_.webp',
    '1768813079863_i5afn5waj_3A6624DC-BC75-4E1F-8025-D314DE88109A.webp'
  ],

  // MDM GENIE CLIMATIQUE
  'climatisation-pompe-a-chaleur-saint-cyr-sur-loire-mdm-genie-climatique-3112': [
    '1768815662425_58ej9c9ij_2024-11-12__1_.webp',
    '1768815662425_9rmv3ts0q_2023-06-28__2_.webp',
    '1768815662425_ajm4m2x14_2023-06-28.webp',
    '1768815662425_fdmctnewm_2023-06-28__1_.webp',
    '1768815662425_qut31807m_2024-11-12.webp',
    '1768815662425_t0hkw6z1o_unnamed__27_.webp',
    '1768815662425_xhviviynl_2024-11-12__2_.webp'
  ],

  // PATINET
  'climatisation-pompe-a-chaleur-reims-patinet-8902': [
    '1768819448441_bdxsfaebl_unnamed__31_.webp',
    '1768819448441_d54hdcvj8_unnamed__29_.webp',
    '1768819448441_yywusruu3_unnamed__30_.webp'
  ],

  // ECO SOLUTIONS
  'climatisation-pompe-a-chaleur-perigny-eco-solutions-2479': [
    '1768820313081_1pw7tuotv_IMG_5911.webp',
    '1768820313081_7lph43dp5_Clim_DAIKIN_la_rochelle.webp',
    '1768820313081_91vr2jn37_2021-01-18.webp',
    '1768820313081_f3uo319ix_unnamed__32_.webp',
    '1768820313081_oc1bdcrzn_Pompe___chaleur_DAIKIN_copie.webp',
    '1768820313081_p3gtznzsa_E_B-D_LA04-08E_3_V3_ip1.webp',
    '1768820313081_zl9sr25ir_unnamed__33_.webp'
  ],

  // AERO SOLUTIONS
  'climatisation-pompe-a-chaleur-le-mans-aero-solutions-6179': [
    '1768822701585_35dbp8hmg_unnamed__39_.webp',
    '1768822701586_jhwtgarx0_unnamed__38_.webp',
    '1768822701586_y6sjklota_unnamed__37_.webp'
  ],

  // EXPERIA CLIMATISATION
  'climatisation-pompe-a-chaleur-saint-paul-de-vence-experia-climatisation-2413': [
    '1768823166911_4rumzrf3r_marco_climatisation.webp',
    '1768823166911_mhszr6nxg_unnamed__41_.webp',
    '1768823166911_p6c487mhm_unnamed__40_.webp'
  ]
};

async function run() {
  console.log("=== Restauration des vraies photos d'origine sans aucun mélange entre entreprises ===");

  // 1. Delete all existing photos in ExpertPhoto table
  const deleteResult = await prisma.expertPhoto.deleteMany({});
  console.log(`Supprimé ${deleteResult.count} anciennes entrées mélangées de ExpertPhoto.`);

  // 2. Insert only authentic photos for each expert
  let totalCreated = 0;
  for (const [slug, filenames] of Object.entries(AUTHENTIC_EXPERT_PHOTOS)) {
    const expert = await prisma.expert.findUnique({
      where: { slug }
    });

    if (!expert) {
      console.warn(`⚠️ Expert introuvable pour le slug: ${slug}`);
      continue;
    }

    console.log(`\nAjout de ${filenames.length} photos authentiques pour: ${expert.nom_entreprise} (${slug})...`);
    for (const file of filenames) {
      const photoUrl = `${STORAGE_BASE_URL}${file}`;
      await prisma.expertPhoto.create({
        data: {
          expert_id: expert.id,
          photo_url: photoUrl
        }
      });
      totalCreated++;
      console.log(`  ✅ ${photoUrl}`);
    }
  }

  console.log(`\n=== TERMINÉ ! ${totalCreated} photos authentiques créées en base sans aucun mélange. ===`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
