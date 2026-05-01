<script lang="ts">
	let apiKey = $state('');
	let errorMessage = $state('');
	let label = $state('');
	let loading = $state(false);
	let generated = $state(false);

	async function generateKey() {
		loading = true;
		const res = await fetch('/api/device-keys/generate', { method: 'POST' });
		const data = await res.json();

		if (data.error) {
			errorMessage = data.error;
			loading = false;
			return;
		}

		apiKey = data.key;
		label = data.label;
		loading = false;
		generated = true;
	}
</script>

<div>
	<h1 class="py-4">Connect your Esp32</h1>

	{#if !generated}
		<button onclick={generateKey} disabled={loading} class="cursor-pointer bg-red-400 px-3 py-2">
			{loading ? 'Geneerating...' : 'Generate Key'}
		</button>
	{:else}
		<div>
			<p>Your API key :</p>
			<code>{apiKey}</code>
		</div>
	{/if}
</div>

{#if loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-transparent"
			></div>
			<p class="font-medium text-black">Fetching ....</p>
		</div>
	</div>
{/if}

{#if errorMessage}
	<div class="absolute top-5 right-5 h-[100px] bg-blue-400">
		<p>{errorMessage}</p>
	</div>
{/if}
