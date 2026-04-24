<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { redirect } from '@sveltejs/kit';

	let { data } = $props();
	let errorMessage = $state('');
	let loggingIn = $state(false);
	let email = $state('');
	let password = $state('');

	async function loginUser() {
		loggingIn = true;
		const { data: verifiedUser, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			errorMessage = error.message;
			return;
		} else {
			goto(`/${verifiedUser.user.id}`);
		}
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form onsubmit={loginUser} class="flex flex-col gap-y-8">
		<label>
			Email:
			<input bind:value={email} required type="email" />
		</label>

		<label>
			Password:
			<input bind:value={password} required type="password" />
		</label>

		<div class="flex flex-col gap-y-3">
			<button type="submit" class="cursor-pointer bg-amber-300 p-2">SignUp</button>
			<hr class="my-5 bg-red-500" />
			<button type="button" class="cursor-pointer bg-amber-300 p-2">Google</button>
		</div>
	</form>
</div>

{#if errorMessage}
	<h3 class="absolute top-5 right-5 bg-amber-700">{errorMessage}</h3>
{/if}
{#if loggingIn}
	<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-transparent"
			></div>
			<p class="font-medium text-black">Give me a moment ....</p>
		</div>
	</div>
{/if}
