<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const range = $derived(data.range);
</script>

<svelte:head><title>Edit {range.name} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Forest Station</h1>
	<a href="/ranges" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Station Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="name">Station Name *</label>
					<input class="form-input" type="text" id="name" name="name" value={range.name} required />
				</div>
				<div class="form-group">
					<label class="form-label" for="district_id">District *</label>
					<select class="form-select" id="district_id" name="district_id" required>
						<option value="">Select a district...</option>
						{#each data.districts as d}
							<option value={d.id} selected={d.id === range.districtId}>{d.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update Station</button>
		<a href="/ranges" class="btn btn-outline">Cancel</a>
	</div>
</form>
