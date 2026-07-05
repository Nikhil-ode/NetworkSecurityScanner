import urllib.request
import urllib.error
import json
import ssl

url = 'https://localhost:8443/api/auth/login/'
payload = json.dumps({"username": "nikhilrajput", "password": "nikhil123"}).encode()

req = urllib.request.Request(
    url,
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        print("STATUS:", resp.status)
        print("BODY:", resp.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("BODY:", e.read().decode())
except Exception as e:
    print("ERROR:", type(e).__name__, e)