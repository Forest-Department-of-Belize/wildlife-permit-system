<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Districts | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Districts ({data.districts.length})</h1>
	{#if user && hasPermission(user.permissions, 'districts-add')}
		<a href="/districts/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add District</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th style="width:120px;">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.districts as d}
					<tr>
						<td>{d.name}</td>
						<td style="display:flex;gap:6px;">
							{#if user && hasPermission(user.permissions, 'districts-edit')}
								<a href="/districts/{d.uuid}/edit" class="btn btn-sm btn-outline"><i class="fas fa-edit"></i></a>
							{/if}
							{#if user && hasPermission(user.permissions, 'districts-delete')}
								<form method="POST" action="?/delete" style="display:inline;">
									<input type="hidden" name="uuid" value={d.uuid} />
									<button type="submit" class="btn btn-sm btn-danger" onclick={(e) => { if (!confirm('Delete this district?')) e.preventDefault(); }}>
										<i class="fas fa-trash"></i>
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{:else}
					<tr><td colspan="2" style="text-align:center;color:var(--gray-600);padding:40px;">No districts found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
