import pathlib

f = pathlib.Path('NetworkSecurityScanner/frontend/src/services/auth.js')
t = f.read_text()

t = t.replace(
    "const response = await apiClient.post('/auth/jwt/create/', {",
    "const response = await apiClient.post('/api/auth/auth/session-login/', {"
)
t = t.replace(
    "  logout: () => {\n    localStorage.removeItem('authToken');",
    "  logout: async () => {\n    await apiClient.post('/api/auth/auth/session-logout/');"
)

f.write_text(t)
print('auth.js updated')