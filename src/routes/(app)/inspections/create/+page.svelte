<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add Inspection | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Inspection</h1>
	<a href="/inspections" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Inspection Details</div>
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
					<label class="form-label" for="range_id">Range/Station</label>
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
					<label class="form-label" for="inspector_name">Inspector Name</label>
					<input class="form-input" type="text" id="inspector_name" name="inspector_name" />
				</div>
				<div class="form-group">
					<label class="form-label" for="inspection_date">Inspection Date</label>
					<input class="form-input" type="date" id="inspection_date" name="inspection_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="inspection_status">Status</label>
					<select class="form-select" id="inspection_status" name="inspection_status">
						<option value="scheduled">Scheduled</option>
						<option value="completed">Completed</option>
					</select>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="notes">Notes</label>
				<textarea class="form-textarea" id="notes" name="notes" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Inspection Findings</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label" for="birds_described">Birds Described</label>
				<textarea class="form-textarea" id="birds_described" name="birds_described" rows="3"></textarea>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="hand_tame" /> Hand Tame</label>
				</div>
				<div class="form-group">
					<label class="form-label" for="preconditions_comments">Preconditions Comments</label>
					<input class="form-input" type="text" id="preconditions_comments" name="preconditions_comments" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="instructions_for_applicant">Instructions for Applicant</label>
				<textarea class="form-textarea" id="instructions_for_applicant" name="instructions_for_applicant" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Follow-up</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="followup_date">Follow-up Date</label>
					<input class="form-input" type="date" id="followup_date" name="followup_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="expected_recheck">Expected Recheck</label>
					<input class="form-input" type="text" id="expected_recheck" name="expected_recheck" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="followup_notes">Follow-up Notes</label>
				<textarea class="form-textarea" id="followup_notes" name="followup_notes" rows="3"></textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Acquisition & Reporting</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="approx_report_date">Approx Report Date</label>
					<input class="form-input" type="text" id="approx_report_date" name="approx_report_date" />
				</div>
				<div class="form-group">
					<label class="form-label" for="when_approx_report_date_provided">When Approx Report Date Provided</label>
					<input class="form-input" type="text" id="when_approx_report_date_provided" name="when_approx_report_date_provided" />
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="date_acquired">Date Acquired</label>
					<input class="form-input" type="text" id="date_acquired" name="date_acquired" />
				</div>
				<div class="form-group">
					<label class="form-label" for="approx_date_acquired">Approx Date Acquired</label>
					<input class="form-input" type="text" id="approx_date_acquired" name="approx_date_acquired" />
				</div>
				<div class="form-group">
					<label class="form-check" style="margin-top:28px;"><input type="checkbox" name="less_12_months_acquired" /> Less Than 12 Months Acquired</label>
				</div>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Inspection</button>
		<a href="/inspections" class="btn btn-outline">Cancel</a>
	</div>
</form>
