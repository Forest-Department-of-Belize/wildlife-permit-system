<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();

	const STATUSES = ['Pending', 'Approved', 'Denied', 'Permit Awarded'];
</script>

<svelte:head><title>Add Application | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Application</h1>
	<a href="/applications" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Application Info</div>
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
					<label class="form-label" for="status">Status</label>
					<select class="form-select" id="status" name="status">
						{#each STATUSES as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="application_date">Application Date</label>
					<input class="form-input" type="date" id="application_date" name="application_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="info_source">Information Source</label>
					<input class="form-input" type="text" id="info_source" name="info_source" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-check">
					<input type="checkbox" name="application_signed" />
					Application Signed
				</label>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Follow-up</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-check">
					<input type="checkbox" name="followup_done" />
					Follow-up Done
				</label>
			</div>
			<div class="form-group">
				<label class="form-label" for="followup_details">Follow-up Details</label>
				<textarea class="form-textarea" id="followup_details" name="followup_details" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Previous Applications</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-check">
						<input type="checkbox" name="applied_previously" />
						Applied Previously
					</label>
				</div>
				<div class="form-group">
					<label class="form-label" for="applied_previously_date">Previous Application Date</label>
					<input class="form-input" type="date" id="applied_previously_date" name="applied_previously_date" />
				</div>
				<div class="form-group">
					<label class="form-check">
						<input type="checkbox" name="previously_approved" />
						Previously Approved
					</label>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="application_experience">Experience</label>
				<textarea class="form-textarea" id="application_experience" name="application_experience" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Notes</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label" for="application_comments">Application Comments</label>
				<textarea class="form-textarea" id="application_comments" name="application_comments" rows="3"></textarea>
			</div>
			<div class="form-group">
				<label class="form-label" for="notes">Internal Notes</label>
				<textarea class="form-textarea" id="notes" name="notes" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Application</button>
		<a href="/applications" class="btn btn-outline">Cancel</a>
	</div>
</form>
