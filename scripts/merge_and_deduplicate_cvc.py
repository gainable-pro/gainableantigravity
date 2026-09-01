import openpyxl
import csv
import json
import os

excel_file = "data_entreprises_cvc.xlsx"
csv_file = "data_entreprises_cvc 2.csv"
json_output = os.path.join("src", "data", "cvc_companies.json")

seen_sirets = set()
seen_sirens = set()
seen_keys = set()
companies = []

def make_key(nom, cp):
    n = (nom or "").strip().lower()
    c = (cp or "").strip()
    return f"{n}||{c}"

def process_company_dict(comp):
    siret = str(comp.get("siret") or "").strip()
    siren = str(comp.get("siren") or "").strip()
    nom = str(comp.get("nomEntreprise") or "").strip()
    cp = str(comp.get("codePostal") or "").strip()

    # Deduplication checks
    if siret and siret != "None" and len(siret) >= 9:
        if siret in seen_sirets:
            return False
        seen_sirets.add(siret)
    elif siren and siren != "None" and len(siren) >= 9:
        if siren in seen_sirens:
            return False
        seen_sirens.add(siren)
    else:
        key = make_key(nom, cp)
        if key in seen_keys:
            return False
        seen_keys.add(key)

    if siret and siret != "None" and len(siret) >= 9:
        seen_sirets.add(siret)
    if siren and siren != "None" and len(siren) >= 9:
        seen_sirens.add(siren)
    seen_keys.add(make_key(nom, cp))

    companies.append(comp)
    return True

# 1. Parse Excel File
print("Processing Excel file...")
wb = openpyxl.load_workbook(excel_file, read_only=True)
sheet = wb.active

headers = []
excel_added = 0
for i, row in enumerate(sheet.iter_rows(values_only=True)):
    if i == 0:
        headers = [str(h).strip() if h else f"col_{idx}" for idx, h in enumerate(row)]
        continue

    if not row or not any(row):
        continue

    r_map = {headers[idx]: row[idx] for idx in range(min(len(headers), len(row)))}

    nom_entreprise = r_map.get("Raison sociale") or r_map.get("nom_entreprise")
    if not nom_entreprise:
        continue

    prenom = r_map.get("Prénom dirigeant principal") or ""
    nom_d = r_map.get("Nom dirigeant principal") or ""
    gerant = f"{prenom} {nom_d}".strip() if (prenom or nom_d) else None

    siret = str(r_map.get("Siret") or "").strip()
    siren = str(r_map.get("Siren") or "").strip()
    ville = str(r_map.get("Ville") or "").strip()
    cp = str(r_map.get("Code postal") or "").strip()
    dept = str(r_map.get("Département") or "").strip()
    region = str(r_map.get("Région") or "").strip()
    tel = str(r_map.get("Téléphone") or "").strip()
    email = str(r_map.get("Email") or "").strip()
    site = str(r_map.get("Site internet") or "").strip()
    
    note = None
    try:
        if r_map.get("Note Google"):
            note = float(r_map.get("Note Google"))
    except:
        pass

    avis = None
    try:
        if r_map.get("Nombre d'avis"):
            avis = int(r_map.get("Nombre d'avis"))
    except:
        pass

    ca = str(r_map.get("Chiffre d'affaires") or "").strip()
    accroche = str(r_map.get("Angle d'accroche") or "").strip()

    c_obj = {
        "id": f"cvc-{len(companies) + 1}",
        "nomEntreprise": str(nom_entreprise).strip(),
        "nomGerant": gerant,
        "siren": siren if siren != "None" else "",
        "siret": siret if siret != "None" else "",
        "ville": ville if ville != "None" else "",
        "codePostal": cp if cp != "None" else "",
        "departement": dept if dept != "None" else "",
        "region": region if region != "None" else "",
        "telephone": tel if tel != "None" else "",
        "email": email if email != "None" else "",
        "siteWeb": site if site != "None" else "",
        "noteGoogle": note,
        "nombreAvis": avis,
        "chiffreAffaires": ca if ca != "None" else "",
        "accroche": accroche if accroche != "None" else ""
    }

    if process_company_dict(c_obj):
        excel_added += 1

print(f"Excel processed: {excel_added} unique companies added.")

# 2. Parse CSV File (Semicolon delimited)
print("Processing CSV file...")
csv_added = 0
with open(csv_file, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f, delimiter=';')
    csv_headers = []
    for i, row in enumerate(reader):
        if i == 0:
            csv_headers = [str(h).replace('"', '').strip() for h in row]
            continue
        
        if not row or not any(row):
            continue

        c_map = {csv_headers[idx]: row[idx].replace('"', '').strip() for idx in range(min(len(csv_headers), len(row)))}
        
        nom_entreprise = c_map.get("Raison sociale") or c_map.get("Adresse normée ligne 1")
        if not nom_entreprise:
            continue

        prenom = c_map.get("Prénom dirigeant principal") or ""
        nom_d = c_map.get("Nom dirigeant principal") or ""
        gerant = f"{prenom} {nom_d}".strip() if (prenom or nom_d) else None

        siret = str(c_map.get("Siret") or "").strip()
        siren = str(c_map.get("Siren") or "").strip()
        ville = str(c_map.get("Ville") or "").strip()
        cp = str(c_map.get("Code postal") or "").strip()
        dept = str(c_map.get("Département") or "").strip()
        region = str(c_map.get("Région") or "").strip()
        tel = str(c_map.get("Téléphone") or "").strip()
        email = str(c_map.get("Email") or "").strip()
        site = str(c_map.get("Site internet") or "").strip()
        ca = str(c_map.get("Chiffre d'affaires") or "").strip()

        note_csv = None
        try:
            if c_map.get("Note Google"):
                note_csv = float(c_map.get("Note Google"))
        except:
            pass

        avis_csv = None
        try:
            if c_map.get("Nombre d'avis"):
                avis_csv = int(c_map.get("Nombre d'avis"))
        except:
            pass

        c_obj = {
            "id": f"cvc-{len(companies) + 1}",
            "nomEntreprise": str(nom_entreprise).strip(),
            "nomGerant": gerant,
            "siren": siren if siren != "None" else "",
            "siret": siret if siret != "None" else "",
            "ville": ville if ville != "None" else "",
            "codePostal": cp if cp != "None" else "",
            "departement": dept if dept != "None" else "",
            "region": region if region != "None" else "",
            "telephone": tel if tel != "None" else "",
            "email": email if email != "None" else "",
            "siteWeb": site if site != "None" else "",
            "noteGoogle": note_csv,
            "nombreAvis": avis_csv,
            "chiffreAffaires": ca if ca != "None" else "",
            "accroche": ""
        }

        if process_company_dict(c_obj):
            csv_added += 1

print(f"CSV 1 processed: {csv_added} new unique companies added.")

# 3. Parse CSV File 3 (data_entreprises_cvc 3.csv)
csv2_file = "data_entreprises_cvc 3.csv"
if os.path.exists(csv2_file):
    print("Processing CSV 3 file...")
    csv3_added = 0
    with open(csv2_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f, delimiter=';')
        csv_headers = []
        for i, row in enumerate(reader):
            if i == 0:
                csv_headers = [str(h).replace('"', '').strip() for h in row]
                continue
            
            if not row or not any(row):
                continue

            c_map = {csv_headers[idx]: row[idx].replace('"', '').strip() for idx in range(min(len(csv_headers), len(row)))}
            
            nom_entreprise = c_map.get("Raison sociale") or c_map.get("Adresse normée ligne 1")
            if not nom_entreprise:
                continue

            prenom = c_map.get("Prénom dirigeant principal") or ""
            nom_d = c_map.get("Nom dirigeant principal") or ""
            gerant = f"{prenom} {nom_d}".strip() if (prenom or nom_d) else None

            siret = str(c_map.get("Siret") or "").strip()
            siren = str(c_map.get("Siren") or "").strip()
            ville = str(c_map.get("Ville") or "").strip()
            cp = str(c_map.get("Code postal") or "").strip()
            dept = str(c_map.get("Département") or "").strip()
            region = str(c_map.get("Région") or "").strip()
            tel = str(c_map.get("Téléphone") or "").strip()
            email = str(c_map.get("Email") or "").strip()
            site = str(c_map.get("Site internet") or "").strip()
            ca = str(c_map.get("Chiffre d'affaires") or "").strip()

            note_csv = None
            try:
                if c_map.get("Note Google"):
                    note_csv = float(c_map.get("Note Google"))
            except:
                pass

            avis_csv = None
            try:
                if c_map.get("Nombre d'avis"):
                    avis_csv = int(c_map.get("Nombre d'avis"))
            except:
                pass

            c_obj = {
                "id": f"cvc-{len(companies) + 1}",
                "nomEntreprise": str(nom_entreprise).strip(),
                "nomGerant": gerant,
                "siren": siren if siren != "None" else "",
                "siret": siret if siret != "None" else "",
                "ville": ville if ville != "None" else "",
                "codePostal": cp if cp != "None" else "",
                "departement": dept if dept != "None" else "",
                "region": region if region != "None" else "",
                "telephone": tel if tel != "None" else "",
                "email": email if email != "None" else "",
                "siteWeb": site if site != "None" else "",
                "noteGoogle": note_csv,
                "nombreAvis": avis_csv,
                "chiffreAffaires": ca if ca != "None" else "",
                "accroche": ""
            }

            if process_company_dict(c_obj):
                csv3_added += 1

    print(f"CSV 3 processed: {csv3_added} new unique companies added.")

print(f"Total Unique Companies in Combined Dataset: {len(companies)}")

with open(json_output, "w", encoding="utf-8") as f:
    json.dump(companies, f, ensure_ascii=False, indent=2)

print(f"Unified dataset successfully written to {json_output}")
