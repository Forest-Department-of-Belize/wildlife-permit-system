<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const district = $derived(data.district);
</script>

<svelte:head><title>Edit {district.name} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit District</h1>
	<a href="/districts" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">District Information</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label" for="name">District Name *</label>
				<input class="form-input" type="text" id="name" name="name" value={district.name} required />
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update District</button>
		<a href="/districts" class="btn btn-outline">Cancel</a>
	</div>
</form>
