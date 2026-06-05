<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Forgot Password | Wildlife Permit System</title></svelte:head>

<div class="auth-card">
	<div class="auth-header">
		<div class="auth-icon"><i class="fas fa-key"></i></div>
		<h2>Forgot Password</h2>
		<p>Enter your email to receive a reset link</p>
	</div>

	{#if form?.success}
		<Alert type="success" message={form.success} />
	{/if}
	{#if form?.error}
		<Alert type="error" message={form.error} />
	{/if}

	<form method="POST">
		<div class="form-group">
			<label class="form-label" for="email">Email</label>
			<input class="form-input" type="email" id="email" name="email" required />
		</div>
		<button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
			Send Reset Link
		</button>
		<div style="text-align:center;margin-top:16px;">
			<a href="/login" style="color:var(--green-700);font-size:14px;">Back to Login</a>
		</div>
	</form>
</div>
