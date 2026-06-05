<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
	const species = $derived(data.species);
</script>

<svelte:head><title>{species.commonName} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">{species.commonName}</h1>
	<div style="display:flex;gap:10px;">
		{#if user && hasPermission(user.permissions, 'species-edit')}
			<a href="/species/{species.uuid}/edit" class="btn btn-primary"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/species" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card">
	<div class="card-header">Species Details</div>
	<div class="card-body">
		{#if species.imageUrl}
			<div style="margin-bottom:20px;">
				<img src={species.imageUrl} alt={species.commonName} style="max-width:300px;border-radius:8px;" />
			</div>
		{/if}
		<div class="grid grid-2">
			<div class="form-group">
				<label class="form-label">Common Name</label>
				<p>{species.commonName}</p>
			</div>
			<div class="form-group">
				<label class="form-label">Scientific Name</label>
				<p><em>{species.scientificName || '-'}</em></p>
			</div>
		</div>
	</div>
</div>
