<script lang="ts">
	let { page = 1, totalPages = 1, baseUrl = '' }: { page?: number; totalPages?: number; baseUrl?: string } = $props();

	function buildUrl(p: number) {
		const url = new URL(baseUrl, 'http://localhost');
		url.searchParams.set('page', String(p));
		return `${url.pathname}${url.search}`;
	}
</script>

{#if totalPages > 1}
	<div class="pagination">
		{#if page > 1}
			<a href={buildUrl(page - 1)}>Prev</a>
		{/if}
		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
			{#if p === page}
				<span class="active">{p}</span>
			{:else if Math.abs(p - page) <= 2 || p === 1 || p === totalPages}
				<a href={buildUrl(p)}>{p}</a>
			{:else if Math.abs(p - page) === 3}
				<span>...</span>
			{/if}
		{/each}
		{#if page < totalPages}
			<a href={buildUrl(page + 1)}>Next</a>
		{/if}
	</div>
{/if}
