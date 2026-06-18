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
		<div class="card-header">Status & Dates</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="banded" checked={p.banded} /> Banded</label>
				</div>
				<div class="form-group">
					<label class="form-label">Parrot Status</label>
					<input class="form-input" type="text" name="parrot_status" value={p.parrotStatus || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">End Date</label>
					<input class="form-input" type="date" name="end_date" value={p.endDate || ''} />
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
			<div class="form-group">
				<label class="form-label">Health Comments by Professional</label>
				<textarea class="form-textarea" name="health_comms_by_professional" rows="3">{p.healthCommsByProfessional || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Species & Age Description</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label">Justification of Sex by Applicant</label>
				<textarea class="form-textarea" name="justification_sex_by_applicant" rows="3">{p.justificationSexByApplicant || ''}</textarea>
			</div>
			<div class="form-group">
				<label class="form-label">Species Description by Applicant</label>
				<textarea class="form-textarea" name="species_descrip_by_applicant" rows="3">{p.speciesDescripByApplicant || ''}</textarea>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Parrot Age Description</label>
					<textarea class="form-textarea" name="parrot_age_description" rows="3">{p.parrotAgeDescription || ''}</textarea>
				</div>
				<div class="form-group">
					<label class="form-label">Date Parrot Age Described</label>
					<input class="form-input" type="date" name="date_parrot_age_described" value={p.dateParrotAgeDescribed || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Parrot Picture</label>
				<input class="form-input" type="text" name="parrot_picture" value={p.parrotPicture || ''} />
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Ownership & Acquisition</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Town Obtained</label>
					<input class="form-input" type="text" name="town_obtained" value={p.townObtained || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">District Obtained</label>
					<input class="form-input" type="text" name="district_obtain" value={p.districtObtain || ''} />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Period of Ownership</label>
					<input class="form-input" type="text" name="period_of_ownership" value={p.periodOfOwnership || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Date Period Provided</label>
					<input class="form-input" type="date" name="date_period_provided" value={p.datePeriodProvided || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Parrot Loss Information</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">When No Parrot</label>
					<input class="form-input" type="text" name="when_no_parrot" value={p.whenNoParrot || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Where No Parrot</label>
					<input class="form-input" type="text" name="where_no_parrot" value={p.whereNoParrot || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Date Parrot Loss Info Provided</label>
					<input class="form-input" type="date" name="date_parrot_loss_info_provided" value={p.dateParrotLossInfoProvided || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">New Owner Information</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">New Owner</label>
					<input class="form-input" type="text" name="new_owner" value={p.newOwner || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">New Owner Address</label>
					<input class="form-input" type="text" name="new_owner_address" value={p.newOwnerAddress || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">New Owner Contact</label>
					<input class="form-input" type="text" name="new_owner_contact" value={p.newOwnerContact || ''} />
				</div>
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
