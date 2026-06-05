<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();

	const STATUSES = ['Processing', 'Active', 'Expired', 'Revoked'];
</script>

<svelte:head><title>Add Permit | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Permit</h1>
	<a href="/permits" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Permit Details</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="applicant_id">Applicant *</label>
					<select class="form-select" id="applicant_id" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={data.preselectedApplicantId === a.id}>{a.lastName}, {a.firstName} {a.middleName || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="range_id">Station / Range</label>
					<select class="form-select" id="range_id" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="permit_number">Permit Number</label>
					<input class="form-input" type="text" id="permit_number" name="permit_number" />
				</div>
				<div class="form-group">
					<label class="form-label" for="reference_number">Reference Number</label>
					<input class="form-input" type="text" id="reference_number" name="reference_number" />
				</div>
				<div class="form-group">
					<label class="form-label" for="status">Status</label>
					<select class="form-select" id="status" name="status">
						{#each STATUSES as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="application_date">Application Date</label>
					<input class="form-input" type="date" id="application_date" name="application_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="issue_date">Issue Date</label>
					<input class="form-input" type="date" id="issue_date" name="issue_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="number_of_pets">Number of Pets</label>
					<input class="form-input" type="number" id="number_of_pets" name="number_of_pets" min="0" value="0" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Additional Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="info_source">Information Source</label>
					<input class="form-input" type="text" id="info_source" name="info_source" />
				</div>
				<div class="form-group">
					<label class="form-label" for="housing">Housing</label>
					<input class="form-input" type="text" id="housing" name="housing" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="picture_url">Picture URL</label>
				<input class="form-input" type="text" id="picture_url" name="picture_url" />
			</div>
			<div class="form-group">
				<label class="form-label" for="permit_comments">Comments</label>
				<textarea class="form-textarea" id="permit_comments" name="permit_comments" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Permit</button>
		<a href="/permits" class="btn btn-outline">Cancel</a>
	</div>
</form>
