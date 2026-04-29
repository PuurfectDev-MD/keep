<script lang="ts">
	import JournalTimeline from '$lib/components/JournalTimeline.svelte';
	import { PlusIcon } from 'phosphor-svelte';

	let { data } = $props();

	let filterData = $state('');
</script>

<div class="flex max-w-screen bg-blue-400">
	<div class="flex w-screen justify-between p-3">
		<h1 class="text-3xl">Your memories</h1>
		<a href="/memory/new"><PlusIcon size={32}></PlusIcon></a>
	</div>
</div>

<div>
	<select bind:value={filterData}>
		<option>Week</option>
		<option>Month</option>
		<option>Quater</option>
		<option>Year</option>
	</select>
</div>

<JournalTimeline time={filterData} id={data.user.id}></JournalTimeline>
