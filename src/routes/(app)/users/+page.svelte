<script lang="ts">
	import { goto } from '$app/navigation';
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Users | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Users ({data.users.length})</h1>
	{#if user && hasPermission(user.permissions, 'users-add')}
		<a href="/users/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add User</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>Station</th>
					<th>Status</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as u}
					<tr class="clickable" ondblclick={() => goto(`/users/${u.uuid}`)}>
						<td><a href="/users/{u.uuid}">{u.lastName === null ? u.firstName : `${u.lastName}, ${u.firstName}`}</a></td>
						<td>{u.email}</td>
						<td>{u.roleName || '-'}</td>
						<td>{u.rangeName || 'All Stations'}</td>
						<td>
							<span class="badge {u.isActive ? 'badge-green' : 'badge-red'}">
								{u.isActive ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="6" style="text-align:center;color:var(--gray-600);padding:40px;">No users found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
