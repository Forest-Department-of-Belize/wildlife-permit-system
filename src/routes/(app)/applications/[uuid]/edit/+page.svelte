<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const app = $derived(data.application);

	const STATUSES = ['Pending', 'Approved', 'Denied', 'Permit Awarded'];
</script>

<svelte:head><title>Edit Application {app.eriApplicationId || ''} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Application</h1>
	<a href="/applications/{app.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
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
					<label class="form-label">Applicant *</label>
					<select class="form-select" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={app.applicantId === a.id}>{a.lastName}, {a.firstName} {a.middleName || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Station / Range</label>
					<select class="form-select" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id} selected={app.rangeId === r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Status</label>
					<select class="form-select" name="status">
						{#each STATUSES as s}
							<option value={s} selected={app.status === s}>{s}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Application Date</label>
					<input class="form-input" type="date" name="application_date" value={app.applicationDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Information Source</label>
					<input class="form-input" type="text" name="info_source" value={app.infoSource || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-check">
					<input type="checkbox" name="application_signed" checked={app.applicationSigned} />
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
					<input type="checkbox" name="followup_done" checked={app.followupDone} />
					Follow-up Done
				</label>
			</div>
			<div class="form-group">
				<label class="form-label">Follow-up Details</label>
				<textarea class="form-textarea" name="followup_details" rows="3">{app.followupDetails || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Previous Applications</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-check">
						<input type="checkbox" name="applied_previously" checked={app.appliedPreviously} />
						Applied Previously
					</label>
				</div>
				<div class="form-group">
					<label class="form-label">Previous Application Date</label>
					<input class="form-input" type="date" name="applied_previously_date" value={app.appliedPreviouslyDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-check">
						<input type="checkbox" name="previously_approved" checked={app.previouslyApproved} />
						Previously Approved
					</label>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Experience</label>
				<textarea class="form-textarea" name="application_experience" rows="3">{app.applicationExperience || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Notes</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label">Application Comments</label>
				<textarea class="form-textarea" name="application_comments" rows="3">{app.applicationComments || ''}</textarea>
			</div>
			<div class="form-group">
				<label class="form-label">Internal Notes</label>
				<textarea class="form-textarea" name="notes" rows="3">{app.notes || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/applications/{app.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
