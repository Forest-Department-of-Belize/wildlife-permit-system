<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';
	let { data } = $props();
	const user = $derived(data.user);
	const c = $derived(data.call);
</script>

<svelte:head><title>Call Detail | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Call Detail</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'calls-edit')}
			<a href="/calls/{c.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/calls" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Call Details</div>
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
				<p><strong>Officer:</strong> {c.officerName || '-'}</p>
				<p><strong>Call Date:</strong> {c.callDate || '-'}</p>
				<p><strong>Number Called:</strong> {c.numberCalled || '-'}</p>
				<p><strong>Language:</strong> {c.language || '-'}</p>
			</div>
			<div>
				<p><strong>Number Functional:</strong> {c.isFunctional ? 'Yes' : 'No'}</p>
				<p><strong>Answered:</strong> <span class="badge" class:badge-green={c.isAnswered} class:badge-red={!c.isAnswered}>{c.isAnswered ? 'Yes' : 'No'}</span></p>
				<p><strong>Spoke to Applicant:</strong> {c.isApplicant ? 'Yes' : 'No'}</p>
				<p><strong>Fully Completed:</strong> <span class="badge" class:badge-green={c.isFullyCompleted} class:badge-yellow={!c.isFullyCompleted}>{c.isFullyCompleted ? 'Yes' : 'No'}</span></p>
				<p><strong>Call ID:</strong> {c.eriCallId || '-'}</p>
				<p><strong>Knows Applicant:</strong> {c.knowApplicant ? 'Yes' : 'No'}</p>
				<p><strong>Relation to Applicant:</strong> {c.relationApplicant || '-'}</p>
				<p><strong>New Applicant Contact:</strong> {c.newApplicantContact || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Consent</div>
	<div class="card-body">
		<div class="grid grid-3">
			<p><strong>Consent Now:</strong> {c.callNowConsent ? 'Yes' : 'No'}</p>
			<p><strong>Consent Later:</strong> {c.callLaterConsent ? 'Yes' : 'No'}</p>
			<p><strong>Call Later Date:</strong> {c.callLaterDate || '-'}</p>
		</div>
		<p><strong>Consents to Digital Resources:</strong> {c.consentsDigitalResources ? 'Yes' : 'No'}</p>
		<p><strong>Scheduled Follow-up:</strong> {c.scheduledFollowup ? 'Yes' : 'No'}</p>
		<p><strong>Follow-up Date:</strong> {c.followupDate || '-'}</p>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Neighborhood Info</div>
	<div class="card-body">
		<div class="grid grid-2">
			<p><strong>Neighbors with Parrots:</strong> {c.numNeighborsParrots ?? '-'}</p>
			<p><strong>Neighborhood Description:</strong> {c.neighborhoodDescription || '-'}</p>
		</div>
	</div>
</div>

{#if c.callComments}
	<div class="card" style="margin-bottom:20px;">
		<div class="card-header">Comments</div>
		<div class="card-body">
			<p>{c.callComments}</p>
		</div>
	</div>
{/if}

<p style="color:var(--gray-600);font-size:13px;margin-top:16px;">
	Created: {c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}
	{#if c.updatedAt} | Updated: {new Date(c.updatedAt).toLocaleString()}{/if}
</p>
