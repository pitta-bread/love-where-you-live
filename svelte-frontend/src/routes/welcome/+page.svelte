<svelte:head>
	<title>Welcome | Love Where You Live</title>
	<meta
		name="description"
		content="Sign in with Google to measure homes against the places that matter most."
	/>
</svelte:head>

<div class="paper-texture min-h-screen bg-background text-primary">
	<nav class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 md:px-12">
		<div class="flex items-center gap-3">
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				class="h-8 w-8 text-accent"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
			>
				<path d="M3 10.5L12 3l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M6.75 9.75V21h10.5V9.75" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class="text-xl font-semibold tracking-tight text-primary">Love Where You Live</span>
		</div>
	</nav>

	<main class="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col items-center justify-center px-6 pb-20 text-center">
		<div class="relative mb-10 w-full max-w-[400px]">
			<svg aria-hidden="true" class="h-full w-full" fill="none" viewBox="0 0 400 300">
				<path
					d="M70 140 C 120 140, 160 260, 200 260 C 240 260, 260 80, 330 80"
					stroke="#C18A63"
					stroke-dasharray="8 8"
					stroke-width="2"
				/>
				<g transform="translate(50, 115)">
					<path d="M20 0 L40 20 L0 20 Z" fill="#2F3E46" opacity="0.1" />
					<rect x="5" y="20" width="30" height="25" fill="#2F3E46" opacity="0.1" />
					<path
						d="M20 0 L40 20 L35 20 L35 45 L5 45 L5 20 L0 20 Z"
						stroke="#2F3E46"
						stroke-width="1.5"
					/>
				</g>
				<g transform="translate(325, 55)">
					<circle cx="15" cy="15" r="4" fill="#C18A63" />
					<path
						d="M15 30 C 15 30, 30 18, 30 15 C 30 6.7, 23.3 0, 15 0 C 6.7 0, 0 6.7, 0 15 C 0 18, 15 30, 15 30 Z"
						stroke="#C18A63"
						stroke-width="1.5"
					/>
				</g>
				<circle cx="180" cy="220" r="2.5" fill="#C18A63" opacity="0.4" />
				<circle cx="230" cy="140" r="2.5" fill="#C18A63" opacity="0.4" />
			</svg>
		</div>

		<div class="mb-12 space-y-6">
			<h1 class="text-balance text-5xl font-semibold leading-tight text-primary md:text-6xl">
				Find your rhythm.
			</h1>
			<p class="text-balance mx-auto max-w-xl text-lg leading-relaxed text-muted">
				Add the places that matter most, then compare every potential home against the life you already live.
			</p>
		</div>

		<a
			href="/login/google"
			class="inline-flex items-center gap-3 rounded-sm border border-border bg-surface px-10 py-4 text-sm font-bold uppercase tracking-[0.05em] text-primary transition duration-300 hover:shadow-md"
		>
			<svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			Sign in with Google
		</a>
	</main>
</div>
