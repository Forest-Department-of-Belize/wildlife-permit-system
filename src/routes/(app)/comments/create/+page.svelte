<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add Comment | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Add New Comment</h1>
	<a href="/comments" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
</div>

{#if form?.error}
	<Alert type="error" message={form.error} />
{/if}

<form method="POST">
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Comment Details</div>
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
					<label class="form-label" for="comment_date">Comment Date</label>
					<input class="form-input" type="date" id="comment_date" name="comment_date" />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label" for="comment_comments">Comment</label>
				<textarea class="form-textarea" id="comment_comments" name="comment_comments" rows="6"></textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Comment</button>
		<a href="/comments" class="btn btn-outline">Cancel</a>
	</div>
</form>
