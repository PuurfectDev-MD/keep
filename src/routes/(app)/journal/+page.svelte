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

<h1 class="text-4xl">Your voice diary</h1>

<div class="flex max-h-[400px] p-4">
	<input
		class="border-4 border-dashed"
		type="file"
		accept="sound/wav, sound/mp3"
		onchange={handleSoundInput}
	/>

	{#if preview}
		<div class="flex justify-end px-3">
			<button class="cursor-pointer" onclick={() => ((selectedFile = null), (preview = ''))}
				><XIcon size={32}></XIcon></button
			>
		</div>

		<div class="flex flex-col gap-y-4 bg-orange-50">
			<audio controls src={preview}></audio>

			<button class="cursor-pointer" onclick={handleUpload}>Upload</button>
		</div>
	{/if}
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
