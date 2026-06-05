<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Import Data | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Import Data</h1>
	<a href="/dashboard" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<div class="card">
	<div class="card-header">Upload Spreadsheet</div>
	<div class="card-body">
		<p style="color:var(--gray-600);margin-bottom:20px;">
			<i class="fas fa-info-circle"></i> Import applicant and parrot records from an Excel spreadsheet (.xlsx format).
		</p>

		<form method="POST" enctype="multipart/form-data">
			<div class="form-group">
				<label class="form-label" for="file">Select File *</label>
				<input class="form-input" type="file" id="file" name="file" accept=".xlsx" required />
			</div>

			<div style="display:flex;gap:10px;margin-top:20px;">
				<button type="submit" class="btn btn-primary"><i class="fas fa-file-import"></i> Import</button>
			</div>
		</form>
	</div>
</div>
