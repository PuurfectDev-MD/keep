<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { supabase } from '$lib/supabase.js';
	import { goto, invalidateAll } from '$app/navigation';

	import { DotsThreeOutlineVerticalIcon } from 'phosphor-svelte';
	let { children, data } = $props();

	const date = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: '2-digit'
	});
	let themes = ['light', 'dark'];
	let theme = $state(data.theme || 'light');

	async function saveTheme(newTheme: string) {
		document.cookie = `data-theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax;`;
		await invalidateAll();
	}

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	});

	let userOptionsTab = $state(false);

	async function logoutUser() {
		const { error } = await supabase.auth.signOut();

		if (!error) {
			invalidateAll();
			goto(`/`);
		}
	}
</script>

<div class="flex h-full max-h-[84px] w-full justify-between bg-[var(--color-nav-top-bg)] p-4">
	<h3 class="px-2"><a class="text-white!" href="/">Keep</a></h3>
	<h3 class="px-4 text-[var(--color-text-muted)]!">{date}</h3>
</div>

{#if data.user}
	<div class="flex">
		<nav
			class="sticky top-0 flex h-screen max-w-[300px] flex-col justify-evenly bg-[var(--color-nav-side-bg)]"
		>
			<div class="w-full p-6">
				<div class="relative flex justify-between">
					<h3 class="text-xl">Good day,</h3>
					<div class="flex h-fit w-fit flex-col justify-end gap-y-8 pl-4">
						<button onclick={() => (userOptionsTab = !userOptionsTab)} class="py-1"
							><DotsThreeOutlineVerticalIcon size={22}></DotsThreeOutlineVerticalIcon></button
						>

						{#if userOptionsTab}
							<div
								class="absolute top-full right-0 z-20 flex w-fit flex-col gap-y-2 bg-amber-200 px-4"
								onmouseleave={() => (userOptionsTab = !userOptionsTab)}
							>
								<a onclick={logoutUser} class="cursor-pointer">Logout</a>
								<a class="cursor-pointer">Option</a>
								<a class="cursor-pointer">OPtion</a>
							</div>
						{/if}
					</div>
				</div>

				<h2>{data.user.user_metadata.username}</h2>
			</div>

			<div class="nav-links grid grid-rows-1 gap-y-5 px-6 py-3">
				<a href="/">Dashboard</a>
				<a href="/memory/new">Memories</a>
				<a href="/voice">Voice</a>
				<a href="/calendar">Calendar</a>
				<a href="/timeline">Timeline</a>
				<a href="/connect">Connect</a>
				<a href="/setting">Settings</a>
			</div>

			<div class="theme-selector mb-8 p-4">
				<select
					bind:value={theme}
					onchange={(e) => {
						saveTheme(e.currentTarget.value);
					}}
				>
					{#each themes as t}
						<option value={t}>{t}</option>
					{/each}
				</select>
			</div>
		</nav>

		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
{/if}

<main class="flex-1 p-6 {data.user ? 'hidden' : ''}">
	{@render children()}
</main>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
