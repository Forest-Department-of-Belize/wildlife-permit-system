<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
	const target = $derived(data.targetUser);
</script>

<svelte:head><title>{target.firstName} {target.lastName} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">{target.firstName} {target.lastName}</h1>
	<div style="display:flex;gap:10px;">
		{#if user && hasPermission(user.permissions, 'users-edit')}
			<a href="/users/{target.uuid}/edit" class="btn btn-primary"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/users" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">User Details</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div class="form-group">
				<label class="form-label">Name</label>
				<p>{target.firstName} {target.lastName}</p>
			</div>
			<div class="form-group">
				<label class="form-label">Email</label>
				<p>{target.email}</p>
			</div>
			<div class="form-group">
				<label class="form-label">Role</label>
				<p>{target.roleName || '-'}</p>
			</div>
			<div class="form-group">
				<label class="form-label">Forest Station</label>
				<p>{target.rangeName || 'All Stations'}</p>
			</div>
			<div class="form-group">
				<label class="form-label">Status</label>
				<p>
					<span class="badge {target.isActive ? 'badge-green' : 'badge-red'}">
						{target.isActive ? 'Active' : 'Inactive'}
					</span>
				</p>
			</div>
			<div class="form-group">
				<label class="form-label">First Login Pending</label>
				<p>
					<span class="badge {target.firstLogin ? 'badge-yellow' : 'badge-gray'}">
						{target.firstLogin ? 'Yes' : 'No'}
					</span>
				</p>
			</div>
			<div class="form-group">
				<label class="form-label">Created</label>
				<p>{target.createdAt ? new Date(target.createdAt).toLocaleDateString() : '-'}</p>
			</div>
		</div>
	</div>
</div>

{#if user && hasPermission(user.permissions, 'users-edit')}
	<div class="card">
		<div class="card-header">Actions</div>
		<div class="card-body" style="display:flex;gap:10px;flex-wrap:wrap;">
			{#if target.isActive}
				<form method="POST" action="?/deactivate">
					<button type="submit" class="btn btn-danger" onclick={(e) => { if (!confirm('Are you sure you want to deactivate this user?')) e.preventDefault(); }}>
						<i class="fas fa-user-slash"></i> Deactivate User
					</button>
				</form>
			{:else}
				<form method="POST" action="?/reactivate">
					<button type="submit" class="btn btn-primary">
						<i class="fas fa-user-check"></i> Reactivate User
					</button>
				</form>
			{/if}
			{#if target.firstLogin}
				<form method="POST" action="?/resendInvite">
					<button type="submit" class="btn btn-secondary">
						<i class="fas fa-envelope"></i> Resend Invite Email
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}
