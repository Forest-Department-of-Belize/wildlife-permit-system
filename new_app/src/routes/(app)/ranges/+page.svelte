<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Forest Stations | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Forest Stations ({data.ranges.length})</h1>
	{#if user && hasPermission(user.permissions, 'ranges-add')}
		<a href="/ranges/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Station</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>District</th>
					<th style="width:120px;">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.ranges as r}
					<tr>
						<td>{r.name}</td>
						<td>{r.districtName || '-'}</td>
						<td style="display:flex;gap:6px;">
							{#if user && hasPermission(user.permissions, 'ranges-edit')}
								<a href="/ranges/{r.uuid}/edit" class="btn btn-sm btn-outline"><i class="fas fa-edit"></i></a>
							{/if}
							{#if user && hasPermission(user.permissions, 'ranges-delete')}
								<form method="POST" action="?/delete" style="display:inline;">
									<input type="hidden" name="uuid" value={r.uuid} />
									<button type="submit" class="btn btn-sm btn-danger" onclick={(e) => { if (!confirm('Delete this station?')) e.preventDefault(); }}>
										<i class="fas fa-trash"></i>
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{:else}
					<tr><td colspan="3" style="text-align:center;color:var(--gray-600);padding:40px;">No forest stations found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
