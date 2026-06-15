import requests
import time

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
    start = time.time()
    try:
        resp = requests.get(url, timeout=30)
        elapsed = time.time() - start
        print(f"{url} | Status: {resp.status_code} | Time: {elapsed:.2f}s | Length: {len(resp.text)}")
    except Exception as e:
        elapsed = time.time() - start
        print(f"{url} | Exception after {elapsed:.2f}s: {e}")
