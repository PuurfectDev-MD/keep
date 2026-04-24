<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { supabase } from '$lib/supabase.js';
	import { goto, invalidateAll } from '$app/navigation';

	let { children, data } = $props();
	let userOptionsTab = $state(false);

	async function logoutUser() {
		const { error } = await supabase.auth.signOut();

		if (!error) {
			invalidateAll();
			goto(`/`);
		}
	}
</script>

{#if data.user?.id}
	<nav class="mt-5 grid w-screen grid-cols-3">
		<div></div>
		<div class="flex w-full flex-row justify-evenly">
			<a href="/">Home</a>
			<a href="/memory">Memories</a>
			<a href="/pictures">Pictures</a>
			<a href="/connect">Connect</a>
		</div>

		<div class="absolute right-5">
			<button class="bg-amber-400 p-2" onclick={() => (userOptionsTab = !userOptionsTab)}
				>User</button
			>
			{#if userOptionsTab}
				<div
					class="flex flex-col gap-y-4 bg-amber-200 py-4"
					onmouseleave={() => (userOptionsTab = !userOptionsTab)}
				>
					<a onclick={logoutUser} class="cursor-pointer py-2">Logout</a>
				</div>
			{/if}
		</div>
	</nav>
{/if}

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
