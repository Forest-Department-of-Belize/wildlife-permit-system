<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const a = $derived(data.applicant);
</script>

<svelte:head><title>Edit {a.firstName} {a.lastName} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Applicant</h1>
	<a href="/applicants/{a.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Personal Information</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">First Name *</label>
					<input class="form-input" type="text" name="first_name" value={a.firstName} required />
				</div>
				<div class="form-group">
					<label class="form-label">Middle Name</label>
					<input class="form-input" type="text" name="middle_name" value={a.middleName || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Last Name *</label>
					<input class="form-input" type="text" name="last_name" value={a.lastName} required />
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Date of Birth</label>
					<input class="form-input" type="date" name="date_of_birth" value={a.dateOfBirth || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">ID Type</label>
					<select class="form-select" name="government_id_type">
						<option value="">Select...</option>
						{#each ['Social Security', 'Passport', "Driver's License", 'Voter ID'] as t}
							<option value={t} selected={a.governmentIdType === t}>{t}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">ID Number</label>
					<input class="form-input" type="text" name="government_id_number" value={a.governmentIdNumber || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Contact & Location</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Phone</label>
					<input class="form-input" type="tel" name="contact_number" value={a.contactNumber || ''} />
					<label class="form-check" style="margin-top:4px;">
						<input type="checkbox" name="contact_number_whatsapp" checked={a.contactNumberWhatsapp} /> WhatsApp
					</label>
				</div>
				<div class="form-group">
					<label class="form-label">Email</label>
					<input class="form-input" type="email" name="email" value={a.email || ''} />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Address</label>
					<input class="form-input" type="text" name="address1" value={a.address1 || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">District</label>
					<select class="form-select" name="district_id">
						<option value="">Select...</option>
						{#each data.districts as d}
							<option value={d.id} selected={a.districtId === d.id}>{d.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Occupation</label>
					<input class="form-input" type="text" name="occupation" value={a.occupation || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Company</label>
					<input class="form-input" type="text" name="company" value={a.company || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Parrot & Housing</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Enclosure Type</label>
					<input class="form-input" type="text" name="enclosure_type" value={a.enclosureType || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Cage Location</label>
					<input class="form-input" type="text" name="cage_location" value={a.cageLocation || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Cage Size (ft)</label>
					<input class="form-input" type="text" name="cage_size_feet" value={a.cageSizeFeet || ''} />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Diet</label>
					<textarea class="form-textarea" name="parrot_diet">{a.parrotDiet || ''}</textarea>
				</div>
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="does_fly_free" checked={a.doesFlyFree} /> Bird flies free</label>
					<label class="form-check" style="margin-top:8px;"><input type="checkbox" name="are_wings_cut" checked={a.areWingsCut} /> Wings are cut</label>
				</div>
			</div>
			<input type="hidden" name="process_status" value={a.processStatus || 'Pending Call'} />
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/applicants/{a.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
