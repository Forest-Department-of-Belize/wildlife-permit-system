<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Login | Wildlife Permit System</title></svelte:head>

<div class="auth-card">
	<div class="auth-header">
		<div class="auth-icon"><i class="fas fa-leaf"></i></div>
		<h2>Wildlife Permit System</h2>
		<p>Belize Forestry Department</p>
	</div>

	{#if form?.error}
		<Alert type="error" message={form.error} />
	{/if}
	{#if data.flash?.type === 'success'}
		<Alert type="success" message={data.flash.message} />
	{/if}

	<form method="POST">
		<div class="form-group">
			<label class="form-label" for="email">Email</label>
			<input class="form-input" type="email" id="email" name="email" required autocomplete="email" />
		</div>
		<div class="form-group">
			<label class="form-label" for="password">Password</label>
			<input class="form-input" type="password" id="password" name="password" required autocomplete="current-password" />
		</div>
		<button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;">
			<i class="fas fa-sign-in-alt"></i> Sign In
		</button>
		<div style="text-align:center;margin-top:16px;">
			<a href="/forgot-password" style="color:var(--green-700);font-size:14px;">Forgot your password?</a>
		</div>
	</form>
</div>
