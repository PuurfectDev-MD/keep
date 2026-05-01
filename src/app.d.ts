// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SupabaseClient } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient,
			session: Session | null,
			user: User | null,
			supabaseAdmin: SupabaseClient
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}


	}
}

export { };
