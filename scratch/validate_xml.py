import requests
import xml.etree.ElementTree as ET

for sitemap_id in range(9):
    url = f"http://localhost:3000/sitemap/{sitemap_id}.xml"
    print(f"\nValidating sitemap {sitemap_id}...")
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            xml_content = resp.text
            # Try parsing the XML
            try:
                root = ET.fromstring(xml_content)
                print(f"Sitemap {sitemap_id} is VALID XML! Total URLs: {len(root)}")
            except ET.ParseError as pe:
                print(f"Sitemap {sitemap_id} XML Parse Error: {pe}")
                # Print the line where it failed
                line_num, col = pe.position
                lines = xml_content.split('\n')
                if line_num <= len(lines):
                    print(f"Error at Line {line_num}, Col {col}:")
                    print(f"Line content: {lines[line_num-1]}")
                else:
                    print(f"Line number {line_num} out of bounds")
        else:
            print(f"Failed to fetch sitemap: Status {resp.status_code}")
    except Exception as e:
        print(f"Exception: {e}")
