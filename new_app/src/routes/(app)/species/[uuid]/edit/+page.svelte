<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const species = $derived(data.species);
</script>

<svelte:head><title>Edit {species.commonName} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Species</h1>
	<a href="/species/{species.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Species Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="common_name">Common Name *</label>
					<input class="form-input" type="text" id="common_name" name="common_name" value={species.commonName} required />
				</div>
				<div class="form-group">
					<label class="form-label" for="scientific_name">Scientific Name</label>
					<input class="form-input" type="text" id="scientific_name" name="scientific_name" value={species.scientificName || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="image_url">Image URL</label>
				<input class="form-input" type="url" id="image_url" name="image_url" value={species.imageUrl || ''} placeholder="https://..." />
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update Species</button>
		<a href="/species/{species.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
