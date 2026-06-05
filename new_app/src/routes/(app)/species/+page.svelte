<script lang="ts">
	import { hasPermission, isAdminOrOIC } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Species | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Species ({data.species.length})</h1>
	{#if user && hasPermission(user.permissions, 'species-add')}
		<a href="/species/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Species</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Image</th>
					<th>Common Name</th>
					<th>Scientific Name</th>
				</tr>
			</thead>
			<tbody>
				{#each data.species as s}
					<tr>
						<td>
							{#if s.imageUrl}
								<img src={s.imageUrl} alt={s.commonName} style="width:40px;height:40px;object-fit:cover;border-radius:4px;" />
							{:else}
								<span style="color:var(--gray-400);"><i class="fas fa-image"></i></span>
							{/if}
						</td>
						<td><a href="/species/{s.uuid}">{s.commonName}</a></td>
						<td><em>{s.scientificName || '-'}</em></td>
					</tr>
				{:else}
					<tr><td colspan="3" style="text-align:center;color:var(--gray-600);padding:40px;">No species found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
