<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	let { data, form } = $props();
	const c = $derived(data.comment);
</script>

<svelte:head><title>Edit Comment {c.eriCommentId || ''} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Edit Comment</h1>
	<a href="/comments/{c.uuid}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
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
					<label class="form-label">Applicant *</label>
					<select class="form-select" name="applicant_id" required>
						<option value="">Select Applicant...</option>
						{#each data.applicants as a}
							<option value={a.id} selected={c.applicantId === a.id}>{a.lastName}, {a.firstName} {a.middleName || ''}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label class="form-label">Comment Date</label>
					<input class="form-input" type="date" name="comment_date" value={c.commentDate || ''} />
				</div>
			</div>
			<div class="form-group">
				<label class="form-label">Comment</label>
				<textarea class="form-textarea" name="comment_comments" rows="6">{c.commentComments || ''}</textarea>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:10px;">
		<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
		<a href="/comments/{c.uuid}" class="btn btn-outline">Cancel</a>
	</div>
</form>
