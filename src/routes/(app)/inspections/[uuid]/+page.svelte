<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';
	let { data } = $props();
	const user = $derived(data.user);
	const i = $derived(data.inspection);
</script>

<svelte:head><title>Inspection {i.inspectionDate || ''} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Inspection Details</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'inspections-edit')}
			<a href="/inspections/{i.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/inspections" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
		<span class="badge" class:badge-green={i.inspectionStatus === 'completed'} class:badge-yellow={i.inspectionStatus === 'scheduled'} style="font-size:14px;">{i.inspectionStatus || '-'}</span>
		{#if i.inspectionDate}
			<span style="color:var(--gray-600);">{i.inspectionDate}</span>
		{/if}
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Inspection Information</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Details</h4>
				<p><strong>Inspector:</strong> {i.inspectorName || '-'}</p>
				<p><strong>Date:</strong> {i.inspectionDate || '-'}</p>
				<p><strong>Status:</strong> {i.inspectionStatus || '-'}</p>
				<p><strong>Applicant:</strong>
					{#if i.applicantUuid}
						<a href="/applicants/{i.applicantUuid}">{i.applicantName}</a>
					{:else}
						-
					{/if}
				</p>
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Notes</h4>
				<p>{i.notes || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Findings</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Birds Described:</strong> {i.birdsDescribed || '-'}</p>
				<p><strong>Hand Tame:</strong> {i.handTame ? 'Yes' : 'No'}</p>
				<p><strong>Preconditions Comments:</strong> {i.preconditionsComments || '-'}</p>
			</div>
			<div>
				<p><strong>Instructions for Applicant:</strong> {i.instructionsForApplicant || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Follow-up</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Follow-up Date:</strong> {i.followupDate || '-'}</p>
				<p><strong>Expected Recheck:</strong> {i.expectedRecheck || '-'}</p>
			</div>
			<div>
				<p><strong>Follow-up Notes:</strong> {i.followupNotes || '-'}</p>
			</div>
		</div>
	</div>
</div>
