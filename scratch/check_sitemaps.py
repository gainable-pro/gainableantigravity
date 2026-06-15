import requests

for sitemap_id in range(9):
    url = f"http://localhost:3000/sitemap/{sitemap_id}.xml"
    print(f"\nChecking sitemap {sitemap_id}: {url}")
    try:
        resp = requests.get(url, timeout=10)
        print(f"Status: {resp.status_code}")
        print(f"Content-Type: {resp.headers.get('Content-Type')}")
        if resp.status_code == 200:
            content = resp.text
            print(f"Length: {len(content)}")
            # print first 300 chars
            print(f"Preview:\n{content[:300]}")
        else:
            print(f"Error Body:\n{resp.text}")
    except Exception as e:
        print(f"Exception: {e}")
