<script lang="ts">
	import { supabase } from '$lib/supabase.js';
	import { PlusIcon, XIcon } from 'phosphor-svelte';

	let { data } = $props();
	let uploading = $state(false);
	let errorMessage = $state('');
	let newMemory = $state(false);
	let preview = $state<string[]>([]);
	let selectedFile = $state<File[]>([]);

	let title = $state('');
	let description = $state('');

	function handleImagePick(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		selectedFile = [...selectedFile, file];
		let previewUrl = URL.createObjectURL(file);
		preview = [...preview, previewUrl];
	}

	async function handleUpload(e: Event) {
		if (!selectedFile.length) return;
		if (!title) {
			errorMessage = 'Insert a title to upload';
			return;
		}
		uploading = true;
		errorMessage = '';

		console.log(data.user.id + uploading);

		let memoryId = crypto.randomUUID();

		const filePaths: string[] = [];
		for (const file of selectedFile) {
			const filePath = `${data.user.id}/${memoryId}/${Date.now()}-${file.name}`;

			const { error: fileUploadErr } = await supabase.storage
				.from('memories')
				.upload(filePath, file); // uploads the url to the temp bucket

			if (fileUploadErr) {
				errorMessage = fileUploadErr.message;
				uploading = false;
				return;
			}
			filePaths.push(filePath);
		}

		const res = await fetch('/api/memory', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filePaths, title, description, memoryId })
		});

		const result = await res.json();

		if (!result.success) {
			errorMessage = result.error ?? 'SomethSing went wrong';
			uploading = false;
			return;
		} else {
			preview = [];
			selectedFile = [];
			title = '';
			description = '';
			newMemory = false;
		}
		uploading = false;
	}
</script>

<div class="mt-8 flex justify-end bg-amber-300 px-4">
	<button onclick={() => (newMemory = !newMemory)}><PlusIcon size={28}></PlusIcon></button>
</div>

{#if newMemory}
	<div class="grid h-[280px] grid-cols-2 border-4 border-red-800 p-4 md:h-[400px]">
		<div class="p-3">
			<input
				class="h-full w-full border-4 border-dashed bg-red-500 p-3"
				type="file"
				accept="image/png, image/jpeg"
				disabled={uploading}
				onchange={handleImagePick}
			/>
		</div>
		<div class="flex flex-col bg-amber-400 p-3">
			<label class="w-full p-3 text-amber-900">
				Title:
				<input bind:value={title} class="w-fit px-3" type="text" />
			</label>
			<textarea bind:value={description} class="h-fit flex-1"></textarea>
		</div>
	</div>

	{#if preview}
		<div class="w-screen flex-row justify-between">
			<h1 class="text-4xl">Preview Panel</h1>
		</div>
		<div class="flex max-w-screen border-4 border-dashed p-3">
			<div class="grid grid-cols-2">
				<div class="px-3">
					<h1>{title}</h1>
					<p>{description}</p>
				</div>
				{#each preview as previewImg}
					<div class="border-4 border-dashed px-3">
						<button
							class="flex cursor-pointer justify-end"
							onclick={() => (preview = preview.filter((p) => p != previewImg))}
							><XIcon size={32}></XIcon></button
						>
						<img src={previewImg} alt="preview" class="h-auto w-full object-cover" />
					</div>
				{/each}
			</div>
		</div>

		{#if selectedFile}
			<button onclick={handleUpload} disabled={uploading} class="cursor-pointer bg-red-200 p-2">
				{uploading ? 'Uploading' : 'Upload'}
			</button>
		{/if}
	{:else}
		<span class="text-white">Upload for preview</span>
	{/if}
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
	<div class="absolute top-5 right-5 h-[100px] bg-blue-400">
		<p>{errorMessage}</p>
	</div>
{/if}
