<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
	const c = $derived(data.comment);
</script>

<svelte:head><title>Comment {c.eriCommentId || c.uuid} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Comment {c.eriCommentId || ''}</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'comments-edit')}
			<a href="/comments/{c.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/comments" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Comment Details</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Applicant:</strong>
					{#if c.applicantUuid}
						<a href="/applicants/{c.applicantUuid}">{c.applicantName}</a>
					{:else}
						-
					{/if}
				</p>
				<p><strong>Comment Date:</strong> {c.commentDate || '-'}</p>
			</div>
			<div>
				<p><strong>Created:</strong> {c.createdAt || '-'}</p>
				<p><strong>Last Updated:</strong> {c.updatedAt || '-'}</p>
			</div>
		</div>
		<hr style="margin:20px 0;border-color:var(--gray-100);" />
		<div>
			<h4 style="margin-bottom:12px;color:var(--green-900);">Comment</h4>
			<p>{c.commentComments || '-'}</p>
		</div>
	</div>
</div>

{#if user && hasPermission(user.permissions, 'comments-delete')}
	<div style="margin-top:40px;padding-top:20px;border-top:1px solid var(--gray-200);">
		<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('Delete this comment? This cannot be undone.')) e.preventDefault(); }}>
			<button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Delete Comment</button>
		</form>
	</div>
{/if}
