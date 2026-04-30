<script lang="ts">
	import { getJournalTimelineData } from '../../routes/(app)/journal.remote';

	let { time, id } = $props();

	const formatMonth = (dateStr: string) => {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase();
	};

	const formatDay = (dateStr: string) => {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);
	};
</script>

{#await getJournalTimelineData({ time, id })}
	<p>Loading....</p>
{:then result}
	{#if result.type == 'success'}
		{#each result.days as day}
			<div class="flex items-stretch gap-6 px-2 py-9">
				<div class="relative flex flex-col items-center">
					<div
						class="z-10 flex h-14 w-12 flex-col items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] text-center"
					>
						<span class="text-[9px] tracking-widest text-[var(--color-text-inverse)] uppercase">
							{formatMonth(day.date)}
						</span>
						<span class="font-serif text-2xl leading-tight text-[var(--color-text-inverse)]">
							{formatDay(day.date)}
						</span>
					</div>
					<div class="w-[3px] flex-1 bg-[var(--color-accent-hover)]"></div>
				</div>

				<div class="card my-6 flex-1">
					<div>
						<h1 class="text-4xl">{day.date}</h1>
						<hr class="my-4" />
					</div>

					<div class="flex flex-col gap-y-4">
						{#each day.memories as memory}
							{#if memory.type == 'success'}
								<div class="card rounded-2xl! p-4">
									<h1 class="text-lg font-bold">{memory.title}</h1>
									<div class="grid grid-cols-3 gap-x-3 py-4">
										{#each memory.imageUrls as url}
											<img src={url} alt="Memory" class="h-full rounded-2xl object-cover" />
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</div>

					<div class="my-4 flex flex-col gap-y-4">
						{#each day.voiceDiaries as voice}
							{#if voice.type == 'success'}
								<div
									class="card flex justify-center rounded-2xl! bg-[var(--color-border-muted)]! p-4"
								>
									<audio src={voice.audioUrl} controls></audio>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<p>There was an error loading data</p>
	{/if}
{/await}
