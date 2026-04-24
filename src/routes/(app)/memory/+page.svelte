<script lang="ts">
	import { supabase } from '$lib/supabase.js';

	let { data } = $props();
	let uploading = $state(false);
	let errorMessage = $state('');

	let preview = $state<string | null>(null);
	let selectedFile = $state<File | null>(null);

	function handleImagePick(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		selectedFile = file;
		preview = URL.createObjectURL(file);
	}

	async function handleImageUpload(e: Event) {
		if (!selectedFile) return;
		uploading = true;
		errorMessage = '';

		console.log(data.user.id + uploading);
		const { error: fileUploadErr } = await supabase.storage
			.from('test')
			.upload(`${Date.now()}-${selectedFile.name}`, selectedFile);
		uploading = false;

		if (fileUploadErr) {
			errorMessage = fileUploadErr.message;
			return;
		}
		preview = null;
		selectedFile = null;
		console.log('File has been uploaded succesfully');
	}
</script>

<div class="m-4 flex h-[400px] justify-center bg-amber-600">
	<input
		class="h-full w-full"
		type="file"
		accept="image/png, image/jpeg"
		disabled={uploading}
		onchange={handleImagePick}
	/>

	{#if preview}
		<img src={preview} alt="preview" class="h-full w-full object-cover" />
	{:else}
		<span class="text-white">Click to pick an image</span>
	{/if}
</div>

{#if selectedFile}
	<button onclick={handleImageUpload} disabled={uploading} class="cursor-pointer bg-red-200 p-2">
		{uploading ? 'Uploading' : 'Upload'}
	</button>
{/if}

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

{#if errorMessage}
	<div class="absolute top-5 right-5">
		<p>{errorMessage}</p>
	</div>
{/if}
