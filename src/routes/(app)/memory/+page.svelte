<script lang="ts">
	import JournalTimeline from '$lib/components/JournalTimeline.svelte';

	let { data } = $props();

	let filterData = $state('');
</script>

<div class="flex max-w-screen bg-blue-400">
	<div class="p-3">
		<h1 class="text-3xl">Your memories</h1>
	</div>

	<div>
		<select bind:value={filterData}>
			<option>Week</option>
			<option>Month</option>
			<option>Quater</option>
			<option>Year</option>
		</select>
	</div>
</div>

<JournalTimeline time={filterData} id={data.user.id}></JournalTimeline>
