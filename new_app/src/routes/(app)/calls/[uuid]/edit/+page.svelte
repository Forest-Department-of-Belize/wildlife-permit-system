<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const c = $derived(data.call);
</script>

<svelte:head><title>Edit Call | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Call</h1>
	<a href="/calls/{c.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Call Details</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="applicant_id">Applicant *</label>
					<select class="form-select" id="applicant_id" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={c.applicantId === a.id}>{a.lastName}, {a.firstName} {a.middleName || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label" for="call_date">Call Date</label>
					<input class="form-input" type="date" id="call_date" name="call_date" value={c.callDate || ''} />
				</div>
			</div>
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="number_called">Number Called</label>
					<input class="form-input" type="tel" id="number_called" name="number_called" value={c.numberCalled || ''} />
				</div>
				<div class="form-group">
					<label class="form-label" for="language">Language</label>
					<input class="form-input" type="text" id="language" name="language" value={c.language || ''} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Call Outcome</div>
		<div class="card-body">
			<div class="grid grid-3">
				<label class="form-check"><input type="checkbox" name="is_functional" checked={c.isFunctional} /> Number Functional</label>
				<label class="form-check"><input type="checkbox" name="is_answered" checked={c.isAnswered} /> Call Answered</label>
				<label class="form-check"><input type="checkbox" name="is_applicant" checked={c.isApplicant} /> Spoke to Applicant</label>
			</div>
			<div class="grid grid-3" style="margin-top:12px;">
				<label class="form-check"><input type="checkbox" name="is_fully_completed" checked={c.isFullyCompleted} /> Fully Completed</label>
				<label class="form-check"><input type="checkbox" name="call_now_consent" checked={c.callNowConsent} /> Consent (Now)</label>
				<label class="form-check"><input type="checkbox" name="call_later_consent" checked={c.callLaterConsent} /> Consent (Later)</label>
			</div>
			<div class="grid grid-2" style="margin-top:12px;">
				<div class="form-group">
					<label class="form-label" for="call_later_date">Call Later Date</label>
					<input class="form-input" type="date" id="call_later_date" name="call_later_date" value={c.callLaterDate || ''} />
				</div>
				<label class="form-check" style="align-self:center;"><input type="checkbox" name="consents_digital_resources" checked={c.consentsDigitalResources} /> Consents to Digital Resources</label>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Neighborhood Info</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label" for="num_neighbors_parrots">Number of Neighbors with Parrots</label>
					<input class="form-input" type="number" id="num_neighbors_parrots" name="num_neighbors_parrots" min="0" value={c.numNeighborsParrots ?? ''} />
				</div>
				<div class="form-group">
					<label class="form-label" for="neighborhood_description">Neighborhood Description</label>
					<textarea class="form-textarea" id="neighborhood_description" name="neighborhood_description">{c.neighborhoodDescription || ''}</textarea>
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Comments</div>
		<div class="card-body">
			<div class="form-group">
				<textarea class="form-textarea" id="call_comments" name="call_comments" rows="4">{c.callComments || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/calls/{c.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
