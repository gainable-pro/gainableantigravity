import requests

urls = [
    "https://www.gainable.fr/sitemap/0.xml",
    "https://www.gainable.fr/sitemap/1.xml",
    "https://www.gainable.fr/sitemap/2.xml",
    "https://www.gainable.fr/sitemap/3.xml",
    "https://www.gainable.fr/sitemap/4.xml",
    "https://www.gainable.fr/sitemap/5.xml",
    "https://www.gainable.fr/sitemap/6.xml",
    "https://www.gainable.fr/sitemap/7.xml",
    "https://www.gainable.fr/sitemap/8.xml"
]

for url in urls:
    print(f"\nChecking live sitemap: {url}")
    try:
        resp = requests.get(url, timeout=15)
        print(f"Status: {resp.status_code}")
        print(f"Content-Type: {resp.headers.get('Content-Type')}")
        print(f"Length: {len(resp.text)}")
        if resp.status_code != 200:
            print(f"Error Preview: {resp.text[:300]}")
    except Exception as e:
        print(f"Exception: {e}")
