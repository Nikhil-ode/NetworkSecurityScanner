import pathlib

f = pathlib.Path('NetworkSecurityScanner/frontend/src/services/auth.js')
t = f.read_text()
t = t.replace(
    "    await apiClient.post('/api/auth/auth/session-logout/');\n    // Optional: clear other stored auth data if needed\n    if (window.location.pathname !== '/login') {\n      window.location.href = '/login';\n    }\n",
    "    await apiClient.post('/api/auth/auth/session-logout/');\n"
)
f.write_text(t)
print('done')