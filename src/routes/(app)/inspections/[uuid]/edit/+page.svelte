<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const i = $derived(data.inspection);
</script>

<svelte:head><title>Edit Inspection | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Inspection</h1>
	<a href="/inspections/{i.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
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
					<label class="form-label">Applicant *</label>
					<select class="form-select" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={i.applicantId === a.id}>{a.lastName}, {a.firstName} - {a.contactNumber || a.email || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Range/Station</label>
					<select class="form-select" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id} selected={i.rangeId === r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Inspector Name</label>
					<input class="form-input" type="text" name="inspector_name" value={i.inspectorName || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Inspection Date</label>
					<input class="form-input" type="date" name="inspection_date" value={i.inspectionDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Status</label>
					<select class="form-select" name="inspection_status">
						{#each ['scheduled', 'completed'] as s}
							<option value={s} selected={i.inspectionStatus === s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Notes</label>
				<textarea class="form-textarea" name="notes" rows="3">{i.notes || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Inspection Findings</div>
		<div class="card-body">
			<div class="form-group">
				<label class="form-label">Birds Described</label>
				<textarea class="form-textarea" name="birds_described" rows="3">{i.birdsDescribed || ''}</textarea>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="hand_tame" checked={i.handTame} /> Hand Tame</label>
				</div>
				<div class="form-group">
					<label class="form-label">Preconditions Comments</label>
					<input class="form-input" type="text" name="preconditions_comments" value={i.preconditionsComments || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Instructions for Applicant</label>
				<textarea class="form-textarea" name="instructions_for_applicant" rows="3">{i.instructionsForApplicant || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Acquisition & Reporting</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Approx. Report Date</label>
					<input class="form-input" type="date" name="approx_report_date" value={i.approxReportDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">When Approx. Report Date Provided</label>
					<input class="form-input" type="date" name="when_approx_report_date_provided" value={i.whenApproxReportDateProvided || ''} />
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Date Acquired</label>
					<input class="form-input" type="date" name="date_acquired" value={i.dateAcquired || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Approx. Date Acquired</label>
					<input class="form-input" type="text" name="approx_date_acquired" value={i.approxDateAcquired || ''} />
				</div>
				<div class="form-group" style="padding-top:24px;">
					<label class="form-check"><input type="checkbox" name="less_12_months_acquired" checked={i.lessTwelveMonthsAcquired} /> Less than 12 Months Acquired</label>
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Follow-up</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Follow-up Date</label>
					<input class="form-input" type="date" name="followup_date" value={i.followupDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Expected Recheck</label>
					<input class="form-input" type="text" name="expected_recheck" value={i.expectedRecheck || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Follow-up Notes</label>
				<textarea class="form-textarea" name="followup_notes" rows="3">{i.followupNotes || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/inspections/{i.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
