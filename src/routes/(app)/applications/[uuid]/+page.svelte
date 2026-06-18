<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
	const app = $derived(data.application);

	function statusBadge(status: string | null) {
		if (!status) return 'badge-gray';
		if (status === 'Approved' || status === 'Permit Awarded') return 'badge-green';
		if (status === 'Pending') return 'badge-blue';
		if (status === 'Denied') return 'badge-red';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Application {app.eriApplicationId || app.uuid} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Application {app.eriApplicationId || ''}</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'applications-edit')}
			<a href="/applications/{app.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/applications" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
		<span class="badge {statusBadge(app.status)}" style="font-size:14px;">{app.status || 'Pending'}</span>
		{#if app.eriApplicationId}
			<span style="color:var(--gray-600);">Application # {app.eriApplicationId}</span>
		{/if}
		{#if app.applicationSigned}
			<span class="badge badge-green">Signed</span>
		{/if}
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Application Info</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Details</h4>
				<p><strong>Applicant:</strong>
					{#if app.applicantUuid}
						<a href="/applicants/{app.applicantUuid}">{app.applicantName}</a>
					{:else}
						-
					{/if}
				</p>
				<p><strong>Station / Range:</strong> {app.rangeName || '-'}</p>
				<p><strong>Information Source:</strong> {app.infoSource || '-'}</p>
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Dates</h4>
				<p><strong>Application Date:</strong> {app.applicationDate || '-'}</p>
				<p><strong>Application Signed:</strong> {app.applicationSigned ? 'Yes' : 'No'}</p>
				<p><strong>Created:</strong> {app.createdAt || '-'}</p>
				<p><strong>Last Updated:</strong> {app.updatedAt || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Follow-up</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Follow-up Done:</strong> {app.followupDone ? 'Yes' : 'No'}</p>
			</div>
			<div>
				<p><strong>Follow-up Details:</strong> {app.followupDetails || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Previous Applications</div>
	<div class="card-body">
		<div class="grid grid-3">
			<div>
				<p><strong>Applied Previously:</strong> {app.appliedPreviously ? 'Yes' : 'No'}</p>
			</div>
			<div>
				<p><strong>Previous Application Date:</strong> {app.appliedPreviouslyDate || '-'}</p>
			</div>
			<div>
				<p><strong>Previously Approved:</strong> {app.previouslyApproved ? 'Yes' : 'No'}</p>
			</div>
		</div>
		{#if app.applicationExperience}
			<hr style="margin:20px 0;border-color:var(--gray-100);" />
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Experience</h4>
				<p>{app.applicationExperience}</p>
			</div>
		{/if}
	</div>
</div>

{#if app.applicationComments || app.notes}
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Notes</div>
		<div class="card-body">
			{#if app.applicationComments}
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Application Comments</h4>
					<p>{app.applicationComments}</p>
				</div>
			{/if}
			{#if app.applicationComments && app.notes}
				<hr style="margin:20px 0;border-color:var(--gray-100);" />
			{/if}
			{#if app.notes}
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Internal Notes</h4>
					<p>{app.notes}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if user && hasPermission(user.permissions, 'applications-delete')}
	<div style="margin-top:40px;padding-top:20px;border-top:1px solid var(--gray-200);">
		<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('Delete this application? This cannot be undone.')) e.preventDefault(); }}>
			<button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Delete Application</button>
		</form>
	</div>
{/if}
