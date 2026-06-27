import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Only read cookies from Server Components.
        // Supabase may attempt to refresh tokens (writes cookies) during rendering.
        // Next.js will crash if cookies are modified during layout/page render.
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // No-op: prevent cookie mutations during render.
        },
      },
    },
  );

}

