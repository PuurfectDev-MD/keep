<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	let { data } = $props();

	import { GoogleLogoIcon } from 'phosphor-svelte';
	let errorMessage = $state('');
	let loggingIn = $state(false);
	let email = $state('');
	let password = $state('');

	async function handleGoogleAuth() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				// This is where Supabase sends the code after Google is done
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (error) console.error('Auth error:', error.message);
	}

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
			await invalidateAll();
			goto(`/${verifiedUser.user.id}`);
		}
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form onsubmit={loginUser} class="form-page flex flex-col gap-y-8">
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
			<button
				onclick={() => handleGoogleAuth()}
				type="button"
				class=" cursor-pointer bg-amber-300 p-2 pl-[45%]"
			>
				<GoogleLogoIcon size={28}></GoogleLogoIcon>
			</button>
		</div>
	</form>
</div>

<div class="absolute inset-x-0 bottom-5 flex justify-center gap-x-4">
	<h4>Dont have an account?</h4>
	<a href="/auth/signup" class="py-1">Signup</a>
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
