<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Setup Account | Wildlife Permit System</title></svelte:head>

<div class="auth-card">
	<div class="auth-header">
		<div class="auth-icon"><i class="fas fa-user-plus"></i></div>
		<h2>Set Up Your Account</h2>
		<p>Welcome, {data.invitedUser?.firstName}!</p>
	</div>

	{#if form?.error}
		<Alert type="error" message={form.error} />
	{/if}

	<form method="POST">
		<div class="form-group">
			<label class="form-label" for="password">Password</label>
			<input class="form-input" type="password" id="password" name="password" required minlength="8" />
		</div>
		<div class="form-group">
			<label class="form-label" for="confirm_password">Confirm Password</label>
			<input class="form-input" type="password" id="confirm_password" name="confirm_password" required minlength="8" />
		</div>
		<button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
			Set Up Account
		</button>
	</form>
</div>
