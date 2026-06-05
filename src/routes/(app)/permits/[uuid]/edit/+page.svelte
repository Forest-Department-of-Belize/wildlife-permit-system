<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const p = $derived(data.permit);

	const STATUSES = ['Processing', 'Active', 'Expired', 'Revoked'];
</script>

<svelte:head><title>Edit Permit {p.permitNumber || ''} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Permit</h1>
	<a href="/permits/{p.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Permit Details</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Applicant ID</label>
					<input class="form-input" type="number" name="applicant_id" value={p.applicantId} required />
					{#if p.applicantUuid}
						<small style="color:var(--gray-600);"><a href="/applicants/{p.applicantUuid}">{p.applicantName}</a></small>
					{/if}
				</div>
				<div class="form-group">
					<label class="form-label">Station / Range</label>
					<select class="form-select" name="range_id">
						<option value="">Select...</option>
						{#each data.ranges as r}
							<option value={r.id} selected={p.rangeId === r.id}>{r.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Permit Number</label>
					<input class="form-input" type="text" name="permit_number" value={p.permitNumber || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Reference Number</label>
					<input class="form-input" type="text" name="reference_number" value={p.referenceNumber || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Status</label>
					<select class="form-select" name="status">
						{#each STATUSES as s}
							<option value={s} selected={p.status === s}>{s}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-3">
				<div class="form-group">
					<label class="form-label">Application Date</label>
					<input class="form-input" type="date" name="application_date" value={p.applicationDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Issue Date</label>
					<input class="form-input" type="date" name="issue_date" value={p.issueDate || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Number of Pets</label>
					<input class="form-input" type="number" name="number_of_pets" min="0" value={p.numberOfPets} />
				</div>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Additional Information</div>
		<div class="card-body">
			<div class="grid grid-2">
				<div class="form-group">
					<label class="form-label">Information Source</label>
					<input class="form-input" type="text" name="info_source" value={p.infoSource || ''} />
				</div>
				<div class="form-group">
					<label class="form-label">Housing</label>
					<input class="form-input" type="text" name="housing" value={p.housing || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Picture URL</label>
				<input class="form-input" type="text" name="picture_url" value={p.pictureUrl || ''} />
			</div>
			<div class="form-group">
				<label class="form-label">Comments</label>
				<textarea class="form-textarea" name="permit_comments" rows="3">{p.permitComments || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/permits/{p.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
