import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase SSR helper only needs cookie values to read the session.
        // We do not mutate cookies from Server Components.
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // No-op
        },
      },
    },
  );
}

