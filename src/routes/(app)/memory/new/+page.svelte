<script lang="ts">
	import { supabase } from '$lib/supabase.js';
	import { PlusIcon, XIcon } from 'phosphor-svelte';

	let { data } = $props();
	let uploading = $state(false);
	let errorMessage = $state('');

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
		}
		uploading = false;
	}
</script>

<div class="flex w-fit justify-start">
	<h2 class="px-3">Add your</h2>
	<h2 class="font-[var(--font-ui)]! text-[var(--color-accent)]!">Memory</h2>
</div>

<div class="grid h-fit grid-cols-2 gap-x-4 pt-6">
	<div class="flex flex-col justify-between">
		<div class="card max-w- w-full">
			<h4 class="pt-4">Photos and videos</h4>
			<hr />
			<input
				class="h-48 max-h-100 w-full border-2 border-dashed border-[var(--color-border)]"
				type="file"
				accept="image/png, image/jpeg"
				disabled={uploading}
				onchange={handleImagePick}
			/>
		</div>

		<div class="card flex flex-col p-3">
			<label class="w-full p-3 text-amber-900">
				Title:
				<input bind:value={title} class="w-fit px-3" type="text" />
			</label>

			<textarea bind:value={description} class="h-fit flex-1 border-2 border-[var(--color-border)]"
			></textarea>
		</div>
	</div>

	<div class="card w-full max-w-full">
		<h4 class="pt-4">Preview</h4>
		<hr />

		<div class="flex max-w-screen p-3">
			<div class="grid grid-cols-2">
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

		<div>
			<button onclick={handleUpload} disabled={uploading} class="cursor-pointer bg-red-200 p-2">
				{uploading ? 'Uploading' : 'Upload'}
			</button>
		</div>
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

{#if errorMessage}
	<div class="absolute top-5 right-5 h-[100px] bg-blue-400">
		<p>{errorMessage}</p>
	</div>
{/if}
