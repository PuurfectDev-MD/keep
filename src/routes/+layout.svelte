<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { supabase } from '$lib/supabase.js';
	import { goto, invalidateAll } from '$app/navigation';

	import { DotsThreeOutlineVerticalIcon } from 'phosphor-svelte';
	let { children, data } = $props();
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

<div class="flex max-h-[64px] w-screen justify-between bg-[var(--color-bg)] p-4">
	<h1 class="px-2 text-[var(--color-text)]">Keep</h1>
	<h3 class="px-4">Friday 27, 2026</h3>
</div>

{#if data.user}
	<div class="flex">
		<nav
			class="sticky top-0 flex h-[calc(100vh-55px)] max-w-[300px] flex-col justify-evenly bg-[var(--nav-active-bg)]"
		>
			<div class="w-full p-6">
				<div class="relative flex justify-between">
					<h1 class="text-xl">Good morning,</h1>
					<div class="flex h-fit w-fit flex-col justify-end gap-y-8">
						<button onclick={() => (userOptionsTab = !userOptionsTab)}
							><DotsThreeOutlineVerticalIcon size={26}></DotsThreeOutlineVerticalIcon></button
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

				<h1>{data.user.email}</h1>
				<div class="flex justify-start pt-4">
					<h4 class="w-fit bg-[var(--color-accent)] px-3 py-2 text-white">Wednesday</h4>
				</div>
			</div>

			<div class="nav-links grid grid-rows-1 gap-y-5 px-6 py-3">
				<a href="/">Dashboard</a>
				<a href="/memory">Memories</a>
				<a href="/logs">Voice</a>
				<a href="/calendar">Calendar</a>
				<a href="/timeline">Timeline</a>
				<a href="/setting">Settings</a>
			</div>

			<div class="theme-selector p-4">
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
	<!-- <nav class="mt-5 grid w-screen grid-cols-3">
		<div></div>
		<div class="flex w-full flex-row justify-evenly">
			<a href="/">Home</a>
			<a href="/memory">Memories</a>
			<a href="/logs">Logs</a>
			<a href="/calendar">Calendar</a>

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
	</nav> -->
{/if}

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
