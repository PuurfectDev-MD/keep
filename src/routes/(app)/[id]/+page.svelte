<script lang="ts">
	import { getUserDashboardInfo, getUserStats } from '../user.remote';

	let { data } = $props();
	const dashboardInfo = getUserDashboardInfo(data.user.id);
</script>

<div class="pt-4">
	<h1>Your Life At A Glance</h1>
</div>
<hr />

{#await getUserStats(data.user.id)}
	<p>Loading...</p>
{:then result}
	<div class="grid grid-cols-4 gap-x-4">
		<div class="card">
			<h1 class="text-4xl">{result.memoriesCount}</h1>
			<h3>Memories</h3>
		</div>
		<div class="card">
			<h1 class="text-4xl">{result.voiceDiaryCount}</h1>
			<h3>Voice Logs</h3>
		</div>
		<div class="card">
			<h1 class="text-4xl">{result.streak.currentStreak}</h1>
			<h3>Streak</h3>
		</div>
		<div class="card">
			<h1 class="text-4xl">XY</h1>
			<h3>Active Days</h3>
		</div>
	</div>
{/await}

{#await dashboardInfo}
	<p>Loading</p>
{:then result}
	{#if result.type === 'success'}
		<div class="grid grid-cols-2 gap-x-6 px-4 py-8">
			<div class="card flex flex-col gap-y-6">
				<div>
					<h3>Your Recent Memories</h3>
				</div>
				{#each result.memories as memory}
					{#if memory.type == 'success'}
						<div class="card flex items-center justify-between p-2">
							<div class="w-1/3">
								<img src={memory.imageUrls[0]} class="h-full w-full rounded object-cover" />
							</div>
							<div class="flex w-2/3 flex-col px-3">
								<h3 class="font-bold">{memory.title}</h3>
								<p>{memory.date.split('T')[0]}</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<div class="card flex flex-col gap-y-6">
				<div>
					<h3>Your Recent VoiceLogs</h3>
				</div>

				{#each result.voices as voice}
					{#if voice.type == 'success'}
						<div class="card flex flex-col justify-between p-2">
							<audio src={voice.audioUrl} controls></audio>
							<p class="px-3">{voice.date.split('T')[0]}</p>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{:else}
		<h1>{result.message}</h1>
	{/if}
{/await}
