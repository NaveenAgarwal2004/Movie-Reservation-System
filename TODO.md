# Fix Login Persistence Issue

## Tasks
- [x] Add refreshToken method to src/api/auth.ts
- [x] Remove automatic redirect to /login on 401 in axios interceptor in src/api/auth.ts
- [x] Modify checkAuth useEffect in src/contexts/AuthContext.tsx to attempt token refresh if getCurrentUser fails with 401
- [x] Test login persistence by refreshing the page after login
