<script lang="ts">
	import {
		KanbanIcon,
		PanoramaIcon,
		MicrophoneIcon,
		FlowArrowIcon,
		CalendarDotsIcon,
		PlayIcon,
		ImageIcon,
		ArrowUpRightIcon
	} from 'phosphor-svelte';
</script>

<div class="flex flex-col items-center pt-8">
	<div class="flex h-fit w-full flex-col items-center gap-y-4 px-8 pb-8">
		<h4 class="font-[var(--font-body)]! opacity-80">Your Life beautifully Kept</h4>
		<div class="flex w-full max-w-[600px] flex-col justify-center">
			<h1 class="pb-3 text-4xl">Make Everyday Worth</h1>
			<h1 class="text-center text-[var(--color-accent)]!">Remembering!</h1>
		</div>
		<p class="w-full max-w-[700px] pt-4 text-center">
			Keep is a place where you save your wonderful life memories for you to reminisce upon later. A
			proof you are living!
		</p>
	</div>

	<div class="flex justify-center gap-x-5 p-10">
		<button class="btn-primary">Start your Keeping</button>
		<div class="flex gap-x-0.5">
			<a href="/" class="py-1">Check out how it works </a>
			<ArrowUpRightIcon size={20}></ArrowUpRightIcon>
		</div>
	</div>
</div>

<hr />

<div class="flex flex-col items-center">
	<p>Ways to use Keep</p>

	<div class="grid grid-cols-5 gap-x-5 py-6">
		<div class="card flex flex-col items-center gap-y-3">
			<div class="pb-3"><KanbanIcon size={36}></KanbanIcon></div>
			<h3>Dashboard</h3>
			<p>Your life acitivity at a glance!</p>
		</div>
		<div class="card flex flex-col items-center gap-y-3">
			<div class="pb-3"><PanoramaIcon size={36}></PanoramaIcon></div>
			<h3>Memories</h3>
			<p>Record, upload, save</p>
		</div>

		<div class="card flex flex-col items-center gap-y-3">
			<div class="pb-3"><MicrophoneIcon size={36}></MicrophoneIcon></div>
			<h3>Voice</h3>
			<p>Voice your mood and feelings in details :)</p>
		</div>
		<div class="card flex flex-col items-center gap-y-3">
			<div class="pb-3"><FlowArrowIcon size={36}></FlowArrowIcon></div>
			<h3>Calendar</h3>
			<p>See the shape of the year</p>
		</div>

		<div class="card flex flex-col items-center gap-y-3">
			<div class="pb-3"><CalendarDotsIcon size={36}></CalendarDotsIcon></div>
			<h3>Timeline</h3>
			<p>Your life is unfolded here</p>
		</div>
	</div>
</div>

<hr />

<div class="grid grid-cols-2 gap-x-8 py-8">
	<div class="flex flex-col gap-y-2 rounded-2xl bg-[var(--color-bg-secondary)]">
		<h3 class="px-5 pt-4">From a memory entry</h3>
		<p class="px-6 pt-6 pb-3">
			I Walked into a fancy place.. sat down and started drinking coffee. Then i feel asleep. I was
			woken up by a old man who somehow was awsome. Bravo.
		</p>

		<div class="flex justify-start gap-x-3 px-6 py-4">
			<ImageIcon size={50}></ImageIcon>
			<ImageIcon size={50}></ImageIcon>
			<ImageIcon size={50}></ImageIcon>
			<ImageIcon size={50}></ImageIcon>
		</div>

		<div class="flex gap-x-3 px-4 pb-4">
			<p>-- May 6th 2026</p>
			<p>4 photos</p>
		</div>
	</div>

	<div class="flex flex-col gap-y-2 rounded-2xl bg-[var(--color-bg-secondary)]">
		<h3 class="px-5 pt-4">From a voice diary</h3>
		<p class="px-6 pt-6 pb-3">
			I Walked into a fancy place.. sat down and started drinking coffee. Then i feel asleep. I was
			woken up by a old man who somehow was awsome. Bravo.
		</p>
		<div class="flex gap-x-4 px-6">
			<PlayIcon size={36}></PlayIcon>
			<div class="flex w-full items-center">
				<hr class="w-1/3! border-t-4! border-t-[var(--color-accent)]!" />
				<hr class="w-2/3! border-t-4! border-t-[var(--color-accent-subtle)]!" />
			</div>
		</div>

		<div class="flex gap-x-3 px-6 py-4">
			<p>-- May 17th 2026</p>
		</div>
	</div>
</div>
