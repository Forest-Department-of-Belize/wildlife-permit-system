<script lang="ts">
	let { type = 'success', message = '' }: { type?: 'success' | 'error'; message?: string } = $props();
	let visible = $state(true);

	$effect(() => {
		if (message) {
			visible = true;
			const timeout = setTimeout(() => { visible = false; }, 5000);
			return () => clearTimeout(timeout);
		}
	});
</script>

{#if visible && message}
	<div class="alert alert-{type}">
		<i class="fas {type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
		<span>{message}</span>
		<button onclick={() => visible = false} style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:16px;">&times;</button>
	</div>
{/if}
