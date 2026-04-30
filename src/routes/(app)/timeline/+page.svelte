<script lang="ts">
	import JournalTimeline from '$lib/components/JournalTimeline.svelte';

	let { data } = $props();

	let filterData = $state('');
</script>

<div class="flex justify-between">
	<div class="flex w-fit justify-start">
		<h2 class="px-3">Your Journal</h2>
		<h2 class=" text-[var(--color-accent)]!">Timeline</h2>
	</div>

	<select bind:value={filterData}>
		<option>Week</option>
		<option>Month</option>
		<option>Quater</option>
		<option>Year</option>
	</select>
</div>

<JournalTimeline time={filterData} id={data.user.id}></JournalTimeline>
