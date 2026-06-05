<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add Applicant | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Applicant</h1>
	<a href="/applicants" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
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
					<label class="form-label" for="first_name">First Name *</label>
					<input class="form-input" type="text" id="first_name" name="first_name" required />
				</div>
				<div class="form-group">
					<label class="form-label" for="middle_name">Middle Name</label>
					<input class="form-input" type="text" id="middle_name" name="middle_name" />
				</div>
				<div class="form-group">
					<label class="form-label" for="last_name">Last Name *</label>
					<input class="form-input" type="text" id="last_name" name="last_name" required />
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="date_of_birth">Date of Birth</label>
					<input class="form-input" type="date" id="date_of_birth" name="date_of_birth" />
				</div>
				<div class="form-group">
					<label class="form-label" for="government_id_type">ID Type</label>
					<select class="form-select" id="government_id_type" name="government_id_type">
						<option value="">Select...</option>
						<option>Social Security</option>
						<option>Passport</option>
						<option>Driver's License</option>
						<option>Voter ID</option>
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="government_id_number">ID Number</label>
					<input class="form-input" type="text" id="government_id_number" name="government_id_number" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Contact & Location</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="contact_number">Phone</label>
					<input class="form-input" type="tel" id="contact_number" name="contact_number" />
					<label class="form-check" style="margin-top:4px;">
						<input type="checkbox" name="contact_number_whatsapp" /> WhatsApp
					</label>
				</div>
				<div class="form-group">
					<label class="form-label" for="email">Email</label>
					<input class="form-input" type="email" id="email" name="email" />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="address1">Address</label>
					<input class="form-input" type="text" id="address1" name="address1" />
				</div>
				<div class="form-group">
					<label class="form-label" for="district_id">District</label>
					<select class="form-select" id="district_id" name="district_id">
						<option value="">Select...</option>
						{#each data.districts as d}
							<option value={d.id}>{d.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="occupation">Occupation</label>
					<input class="form-input" type="text" id="occupation" name="occupation" />
				</div>
				<div class="form-group">
					<label class="form-label" for="company">Company</label>
					<input class="form-input" type="text" id="company" name="company" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Parrot & Housing Details</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="enclosure_type">Enclosure Type</label>
					<input class="form-input" type="text" id="enclosure_type" name="enclosure_type" />
				</div>
				<div class="form-group">
					<label class="form-label" for="cage_location">Cage Location</label>
					<input class="form-input" type="text" id="cage_location" name="cage_location" />
				</div>
				<div class="form-group">
					<label class="form-label" for="cage_size_feet">Cage Size (ft)</label>
					<input class="form-input" type="text" id="cage_size_feet" name="cage_size_feet" />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="parrot_diet">Diet</label>
					<textarea class="form-textarea" id="parrot_diet" name="parrot_diet"></textarea>
				</div>
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="does_fly_free" /> Bird flies free</label>
					<label class="form-check" style="margin-top:8px;"><input type="checkbox" name="are_wings_cut" /> Wings are cut</label>
				</div>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Applicant</button>
		<a href="/applicants" class="btn btn-outline">Cancel</a>
	</div>
</form>
