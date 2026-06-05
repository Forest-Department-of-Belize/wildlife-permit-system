<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add Parrot | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Parrot</h1>
	<a href="/parrots" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Parrot Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="applicant_id">Applicant *</label>
					<select class="form-select" id="applicant_id" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={data.preselectedApplicantId === String(a.id)}>{a.lastName}, {a.firstName} - {a.contactNumber || a.email || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="species_id">Species</label>
					<select class="form-select" id="species_id" name="species_id">
						<option value="">Select Species...</option>
						{#each data.species as s}
							<option value={s.id}>{s.commonName}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="pet_name">Pet Name</label>
					<input class="form-input" type="text" id="pet_name" name="pet_name" />
				</div>
				<div class="form-group">
					<label class="form-label" for="band_number">Band Number</label>
					<input class="form-input" type="text" id="band_number" name="band_number" />
				</div>
				<div class="form-group">
					<label class="form-label" for="sex">Sex</label>
					<select class="form-select" id="sex" name="sex">
						<option value="">Select...</option>
						<option>Male</option>
						<option>Female</option>
						<option>Unknown</option>
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="parrot_age_months">Age (months)</label>
					<input class="form-input" type="number" id="parrot_age_months" name="parrot_age_months" min="0" />
				</div>
				<div class="form-group">
					<label class="form-label" for="method_obtained">Method Obtained</label>
					<input class="form-input" type="text" id="method_obtained" name="method_obtained" />
				</div>
				<div class="form-group">
					<label class="form-label" for="period_of_ownership_months">Ownership (months)</label>
					<input class="form-input" type="number" id="period_of_ownership_months" name="period_of_ownership_months" min="0" />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="range_id">Range/Station</label>
					<select class="form-select" id="range_id" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="info_source">Info Source</label>
					<input class="form-input" type="text" id="info_source" name="info_source" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Housing & Health</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label" for="housing_details">Housing Details</label>
				<textarea class="form-textarea" id="housing_details" name="housing_details" rows="3"></textarea>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="has_parrot" checked /> Has Parrot</label>
				</div>
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="is_healthy" checked /> Is Healthy</label>
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="why_no_parrot">Why No Parrot</label>
					<input class="form-input" type="text" id="why_no_parrot" name="why_no_parrot" />
				</div>
				<div class="form-group">
					<label class="form-label" for="health_comments">Health Comments</label>
					<input class="form-input" type="text" id="health_comments" name="health_comments" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-check"><input type="checkbox" name="confiscated" /> Confiscated</label>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Additional Information</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label" for="stories">Stories</label>
				<textarea class="form-textarea" id="stories" name="stories" rows="3"></textarea>
			</div>
			<div class="form-group">
				<label class="form-label" for="bird_comments">Bird Comments</label>
				<textarea class="form-textarea" id="bird_comments" name="bird_comments" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Parrot</button>
		<a href="/parrots" class="btn btn-outline">Cancel</a>
	</div>
</form>
