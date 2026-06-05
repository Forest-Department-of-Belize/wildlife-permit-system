<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const o = $derived(data.offense);
</script>

<svelte:head><title>Edit Offense | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Offense</h1>
	<a href="/offenses/{o.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Offense Details</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Officer Name</label>
					<input class="form-input" type="text" name="officer_name" value={o.officerName || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Offense Date</label>
					<input class="form-input" type="date" name="offense_date" value={o.offenseDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Station</label>
					<select class="form-select" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id} selected={o.rangeId === r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Illegal Wildlife</label>
				<textarea class="form-textarea" name="illegal_wildlife">{o.illegalWildlife || ''}</textarea>
			</div>
			<div class="form-group">
				<label class="form-label">Reason Confiscated</label>
				<textarea class="form-textarea" name="reason_confiscated">{o.reasonConfiscated || ''}</textarea>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Cage & Status</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Cage Size (ft)</label>
					<input class="form-input" type="text" name="cage_size_feet" value={o.cageSizeFeet || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Cage Location</label>
					<input class="form-input" type="text" name="cage_location" value={o.cageLocation || ''} />
				</div>
				<div class="form-group" style="display:flex;flex-direction:column;gap:8px;padding-top:24px;">
					<label class="form-check"><input type="checkbox" name="hand_tame" checked={o.handTame} /> Hand Tame</label>
					<label class="form-check"><input type="checkbox" name="prior_history" checked={o.priorHistory} /> Prior History</label>
					<label class="form-check"><input type="checkbox" name="cage_confiscated" checked={o.cageConfiscated} /> Cage Confiscated</label>
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Signatures & Notes</div>
		<div class="card-body">
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="signed_officer" checked={o.signedOfficer} /> Signed by Officer</label>
				</div>
				<div class="form-group">
					<label class="form-check"><input type="checkbox" name="signed_offender" checked={o.signedOffender} /> Signed by Offender</label>
				</div>
				<div class="form-group">
					<label class="form-label">Signed Date</label>
					<input class="form-input" type="date" name="signed_date" value={o.signedDate || ''} />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Health Issues</label>
					<textarea class="form-textarea" name="health_issues">{o.healthIssues || ''}</textarea>
				</div>
				<div class="form-group">
					<label class="form-label">Diet Notes</label>
					<textarea class="form-textarea" name="diet_notes">{o.dietNotes || ''}</textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Comments</label>
				<textarea class="form-textarea" name="offense_comments">{o.offenseComments || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/offenses/{o.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
