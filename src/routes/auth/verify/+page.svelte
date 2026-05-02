<script lang="ts">
	import { supabase } from '$lib/supabase.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		// Wait for supabase to set the session
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (session) {
			await invalidateAll();
			goto('/');
		} else {
			supabase.auth.onAuthStateChange(async (event, session) => {
				if (session) {
					await invalidateAll();
					goto('/');
				}
			});
		}
	});
</script>

<p>Verifying your account...</p>
