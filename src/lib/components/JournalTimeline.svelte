<script lang="ts">
	import { getJournalTimelineData } from '../../routes/(app)/journal.remote';

	let { time, id } = $props();
</script>

{#await getJournalTimelineData({ time, id })}
	<p>Loading....</p>
{:then result}
	{#if result.type == 'success'}
		{#each result.days as day}
			<div>
				<h1 class="text-4xl">{day.date}</h1>
			</div>
			{#each day.memories as memory}
				{#if memory.type == 'success'}
					<h1>{memory.title}</h1>

					{#each memory.imageUrls as url}
						<img src={url} />
					{/each}
				{/if}
			{/each}

			{#each day.voiceDiaries as voice}
				{#if voice.type == 'success'}
					<audio src={voice.audioUrl} controls></audio>
				{/if}
			{/each}
		{/each}
	{:else}
		<p>There was an error loading data</p>
	{/if}
{/await}
