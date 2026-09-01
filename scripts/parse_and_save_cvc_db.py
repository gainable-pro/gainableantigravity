import openpyxl
import json
import os

excel_file = "data_entreprises_cvc.xlsx"
json_output = os.path.join("src", "data", "cvc_companies.json")

os.makedirs(os.path.dirname(json_output), exist_ok=True)

print("Loading workbook...")
wb = openpyxl.load_workbook(excel_file, read_only=True)
sheet = wb.active

companies = []
headers = []

for i, row in enumerate(sheet.iter_rows(values_only=True)):
    if i == 0:
        headers = [str(h).strip() if h else f"col_{idx}" for idx, h in enumerate(row)]
        continue

    if not row or not any(row):
        continue

    # Map row to dictionary based on headers
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

    companies.append({
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
        "noteGoogle": note or 4.8,
        "nombreAvis": avis or 28,
        "chiffreAffaires": ca if ca != "None" else "",
        "accroche": accroche if accroche != "None" else ""
    })

print(f"Total companies extracted: {len(companies)}")

with open(json_output, "w", encoding="utf-8") as f:
    json.dump(companies, f, ensure_ascii=False, indent=2)

print(f"Saved to {json_output}")
