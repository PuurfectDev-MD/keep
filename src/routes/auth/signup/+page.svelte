<script lang="ts">
	import { supabase } from '$lib/supabase.js';

	import { GoogleLogoIcon } from 'phosphor-svelte';

	let { data } = $props();
	let message = $state('');
	let confirmPass = $state('');
	let errorMessage = $state('');
	let username = $state('');
	let password = $state('');
	let email = $state('');
	let signingIn = $state(false);

	async function signInWithGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback` //make sure to define this url in google console authorized redirects section
			}
		});
		if (error) {
			errorMessage = 'There was an error signinig you in';
			console.log(error.message);
			return;
		}
	}

	async function handleSignUp(e: SubmitEvent) {
		errorMessage = '';

		if (password !== confirmPass) {
			e.preventDefault();
			e.stopPropagation();
			errorMessage = 'The passwords dont match';
		}

		signingIn = true;
		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					username: username // for user.meta_data.username
				},
				emailRedirectTo: 'https://keeplife.vercel.app/auth/verify'
			}
		});
		console.log('Got the response fromthe db');
		if (error) {
			signingIn = false;
			errorMessage = error.message;
			console.log(error.message);
			return;
		}
		message = 'Check your email!';
	}
</script>

<div class=" flex h-screen items-center justify-center">
	<form onsubmit={handleSignUp} class="form-page flex h-fit flex-col gap-y-6">
		<label>
			username
			<input bind:value={username} required type="text" />
		</label>

		<label>
			Email:
			<input bind:value={email} required type="email" />
		</label>

		<label>
			Password:
			<input bind:value={password} required type="password" />
		</label>

		<label>
			Confirm Password:
			<input required bind:value={confirmPass} />
		</label>
		<div class="flex flex-col gap-y-2">
			<button type="submit" class="cursor-pointer bg-amber-300 p-2">SignUp</button>
			<hr class="my-5 bg-red-500" />
			<button
				onclick={() => signInWithGoogle()}
				type="button"
				class="cursor-pointer bg-amber-300 p-2 pl-[45%]"
			>
				<GoogleLogoIcon size={28}></GoogleLogoIcon>
			</button>
		</div>
	</form>
</div>

{#if errorMessage}
	<h3 class="absolute top-5 right-5 bg-amber-700">{errorMessage}</h3>
{/if}
{#if signingIn}
	<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-transparent"
			></div>
			<p class="font-medium text-black">Give me a moment ....</p>
			{#if message}
				<h4>{message}</h4>
			{/if}
		</div>
	</div>
{/if}
