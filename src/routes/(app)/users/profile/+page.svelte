<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>My Profile | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">My Profile</h1>
	<a href="/dashboard" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Personal Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="first_name">First Name *</label>
					<input class="form-input" type="text" id="first_name" name="first_name" value={user.firstName} required />
				</div>
				<div class="form-group">
					<label class="form-label" for="last_name">Last Name *</label>
					<input class="form-input" type="text" id="last_name" name="last_name" value={user.lastName} required />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="email">Email *</label>
				<input class="form-input" type="email" id="email" name="email" value={user.email} required />
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Change Password</div>
		<div class="card-body">
			<p style="color:var(--gray-600);margin-bottom:15px;">Leave blank to keep your current password.</p>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="new_password">New Password</label>
					<input class="form-input" type="password" id="new_password" name="new_password" minlength="8" placeholder="Minimum 8 characters" />
				</div>
				<div class="form-group">
					<label class="form-label" for="confirm_password">Confirm Password</label>
					<input class="form-input" type="password" id="confirm_password" name="confirm_password" minlength="8" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Account Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Role</label>
					<p>{user.role ?? '-'}</p>
				</div>
				<div class="form-group">
					<label class="form-label">Forest Station</label>
					<p>{user.rangeName ?? 'All Stations'}</p>
				</div>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update Profile</button>
		<a href="/dashboard" class="btn btn-outline">Cancel</a>
	</div>
</form>
