<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div style="display:flex;justify-content:center;align-items:center;min-height:60vh;">
	<div class="card" style="max-width:400px;width:100%;">
		<div class="card-header">Sign Out</div>
		<div class="card-body" style="text-align:center;">
			<p style="margin-bottom:20px;">Are you sure you want to sign out?</p>
			<form method="POST" use:enhance>
				<button type="submit" class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
				<a href="/dashboard" class="btn btn-outline" style="margin-left:10px;">Cancel</a>
			</form>
		</div>
	</div>
</div>
