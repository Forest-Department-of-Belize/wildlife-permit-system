<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Log Offense | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Log New Offense</h1>
	<a href="/offenses" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Offense Details</div>
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
					<label class="form-label" for="offense_date">Offense Date</label>
					<input class="form-input" type="date" id="offense_date" name="offense_date" />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="range_id">Range / Station</label>
					<select class="form-select" id="range_id" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="illegal_wildlife">Illegal Wildlife</label>
					<input class="form-input" type="text" id="illegal_wildlife" name="illegal_wildlife" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Cage & Confiscation</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label" for="cage_size_feet">Cage Size (ft)</label>
					<input class="form-input" type="text" id="cage_size_feet" name="cage_size_feet" />
				</div>
				<div class="form-group">
					<label class="form-label" for="cage_location">Cage Location</label>
					<input class="form-input" type="text" id="cage_location" name="cage_location" />
				</div>
				<div class="form-group">
					<label class="form-label" for="reason_confiscated">Reason Confiscated</label>
					<input class="form-input" type="text" id="reason_confiscated" name="reason_confiscated" />
				</div>
			</div>
			<div class="grid grid-3" style="margin-top:12px;">
				<label class="form-check"><input type="checkbox" name="hand_tame" /> Hand Tame</label>
				<label class="form-check"><input type="checkbox" name="prior_history" /> Prior History</label>
				<label class="form-check"><input type="checkbox" name="cage_confiscated" /> Cage Confiscated</label>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Signatures</div>
		<div class="card-body">
			<div class="grid grid-3">
				<label class="form-check"><input type="checkbox" name="signed_officer" /> Signed by Officer</label>
				<label class="form-check"><input type="checkbox" name="signed_offender" /> Signed by Offender</label>
				<div class="form-group">
					<label class="form-label" for="signed_date">Signed Date</label>
					<input class="form-input" type="date" id="signed_date" name="signed_date" />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Health & Diet</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="health_issues">Health Issues</label>
					<textarea class="form-textarea" id="health_issues" name="health_issues"></textarea>
				</div>
				<div class="form-group">
					<label class="form-label" for="diet_notes">Diet Notes</label>
					<textarea class="form-textarea" id="diet_notes" name="diet_notes"></textarea>
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Acquisition</div>
		<div class="card-body">
			<div class="grid grid-2">
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

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Comments</div>
		<div class="card-body">
			<div class="form-group">
				<textarea class="form-textarea" id="offense_comments" name="offense_comments" rows="4"></textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Offense</button>
		<a href="/offenses" class="btn btn-outline">Cancel</a>
	</div>
</form>
