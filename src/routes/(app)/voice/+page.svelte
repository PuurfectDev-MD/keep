<script lang="ts">
	import { supabase } from '$lib/supabase';

	import { XIcon } from 'phosphor-svelte';

	let selectedFile = $state<File | null>(null);
	let preview = $state('');
	let uploading = $state(false);
	let errorMessage = $state('');
	let { data } = $props();
	function handleSoundInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		selectedFile = file;
		preview = URL.createObjectURL(selectedFile);
	}

	async function handleUpload(e: Event) {
		if (!selectedFile) return;
		uploading = true;
		errorMessage = '';

		let voiceDiaryId = crypto.randomUUID();

		const filePath = `${data.user.id}/${voiceDiaryId}/${Date.now()}-${selectedFile.name}`;

		const { error: soundUploadErr } = await supabase.storage
			.from('voiceDiary')
			.upload(filePath, selectedFile);

		if (soundUploadErr) {
			console.log('Upload error:', soundUploadErr.message, soundUploadErr.statusCode);
			errorMessage = soundUploadErr.message;
			uploading = false;
			return;
		}

		const res = await fetch('/api/voiceDiary', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filePath, voiceDiaryId })
		});

		const result = await res.json();

		if (!result.success) {
			errorMessage = result.error ?? 'Something went wrong ';

			return;
		} else {
			preview = '';
			selectedFile = null;
		}
		uploading = false;
	}
</script>

<div class="flex w-fit justify-start">
	<h2 class="px-3">Add your</h2>
	<h2 class="font-[var(--font-ui)]! text-[var(--color-accent)]!">Voice Log</h2>
</div>

<div class="grid h-fit grid-cols-2 gap-x-4 pt-6">
	<div class="flex flex-col justify-between">
		<div class="card max-w- w-full">
			<h4 class="pt-4">Audio file</h4>
			<hr />
			<input
				class="h-48 max-h-100 w-full border-2 border-dashed border-[var(--color-border)]"
				type="file"
				accept="sound/wav, sound/mp3"
				onchange={handleSoundInput}
			/>
		</div>
	</div>

	<div class="card w-full max-w-full">
		<h4 class="pt-4">Preview</h4>
		<hr />

		<div class="flex max-w-screen p-3">
			{#if preview}
				<div class="flex justify-end px-3">
					<button class="cursor-pointer" onclick={() => ((selectedFile = null), (preview = ''))}
						><XIcon size={32}></XIcon></button
					>
				</div>

				<div class="flex flex-col gap-y-4 bg-orange-50">
					<audio controls src={preview}></audio>
				</div>
			{/if}
		</div>

		{#if selectedFile}
			<div>
				<button onclick={handleUpload} disabled={uploading} class="cursor-pointer bg-red-200 p-2">
					{uploading ? 'Uploading' : 'Upload'}
				</button>
			</div>
		{/if}
	</div>
</div>

{#if uploading}
	<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-transparent"
			></div>
			<p class="font-medium text-black">uploading ....</p>
		</div>
	</div>
{/if}
