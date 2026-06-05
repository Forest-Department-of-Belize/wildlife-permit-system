<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const p = $derived(data.parrot);
</script>

<svelte:head><title>Edit {p.petName || 'Parrot'} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Parrot</h1>
	<a href="/parrots/{p.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
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
					<label class="form-label">Applicant *</label>
					<select class="form-select" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={p.applicantId === a.id}>{a.lastName}, {a.firstName} - {a.contactNumber || a.email || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Species</label>
					<select class="form-select" name="species_id">
						<option value="">Select Species...</option>
						{#each data.species as s}
							<option value={s.id} selected={p.speciesId === s.id}>{s.commonName}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Pet Name</label>
					<input class="form-input" type="text" name="pet_name" value={p.petName || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Band Number</label>
					<input class="form-input" type="text" name="band_number" value={p.bandNumber || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Sex</label>
					<select class="form-select" name="sex">
						<option value="">Select...</option>
						{#each ['Male', 'Female', 'Unknown'] as s}
							<option value={s} selected={p.sex === s}>{s}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Age (months)</label>
					<input class="form-input" type="number" name="parrot_age_months" value={p.parrotAgeMonths ?? ''} min="0" />
				</div>
				<div class="form-group">
					<label class="form-label">Method Obtained</label>
					<input class="form-input" type="text" name="method_obtained" value={p.methodObtained || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Ownership (months)</label>
					<input class="form-input" type="number" name="period_of_ownership_months" value={p.periodOfOwnershipMonths ?? ''} min="0" />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Range/Station</label>
					<select class="form-select" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id} selected={p.rangeId === r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Info Source</label>
					<input class="form-input" type="text" name="info_source" value={p.infoSource || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Housing & Health</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label">Housing Details</label>
				<textarea class="form-textarea" name="housing_details" rows="3">{p.housingDetails || ''}</textarea>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="has_parrot" checked={p.hasParrot} /> Has Parrot</label>
				</div>
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="is_healthy" checked={p.isHealthy} /> Is Healthy</label>
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Why No Parrot</label>
					<input class="form-input" type="text" name="why_no_parrot" value={p.whyNoParrot || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Health Comments</label>
					<input class="form-input" type="text" name="health_comments" value={p.healthComments || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-check"><input type="checkbox" name="confiscated" checked={p.confiscated} /> Confiscated</label>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Additional Information</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label">Stories</label>
				<textarea class="form-textarea" name="stories" rows="3">{p.stories || ''}</textarea>
			</div>
			<div class="form-group">
				<label class="form-label">Bird Comments</label>
				<textarea class="form-textarea" name="bird_comments" rows="3">{p.birdComments || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/parrots/{p.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
