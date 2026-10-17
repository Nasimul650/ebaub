@AGENTS.md

# Additional Notes for Claude

- This project uses Next.js 16 (not 15). The middleware file is `src/proxy.ts`, not `middleware.ts`.
- Supabase client creation differs between server components (`utils/supabase/server.ts`), client components (`utils/supabase/client.ts`), and admin operations (`utils/supabase/admin.ts`).
- All server actions are in `src/app/actions/` — check auth before any mutation.
- The `campus-*` Tailwind colour tokens are defined in `globals.css`.
