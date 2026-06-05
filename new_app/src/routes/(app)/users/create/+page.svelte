<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add User | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New User</h1>
	<a href="/users" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">User Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="first_name">First Name *</label>
					<input class="form-input" type="text" id="first_name" name="first_name" required />
				</div>
				<div class="form-group">
					<label class="form-label" for="last_name">Last Name *</label>
					<input class="form-input" type="text" id="last_name" name="last_name" required />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="email">Email *</label>
				<input class="form-input" type="email" id="email" name="email" required />
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="role_id">Role *</label>
					<select class="form-select" id="role_id" name="role_id" required>
						<option value="">Select a role...</option>
						{#each data.roles as r}
							<option value={r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="range_id">Forest Station</label>
					<select class="form-select" id="range_id" name="range_id">
						<option value="">All Stations</option>
						{#each data.ranges as r}
							<option value={r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>

	<p style="color:var(--gray-600);margin-bottom:15px;">
		<i class="fas fa-info-circle"></i> An invitation email will be sent to the user to set up their account.
	</p>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Create User & Send Invite</button>
		<a href="/users" class="btn btn-outline">Cancel</a>
	</div>
</form>
