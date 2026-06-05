<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';
	let { data } = $props();
	const user = $derived(data.user);
	const o = $derived(data.offense);
</script>

<svelte:head><title>Offense Details | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Offense Details</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'offenses-edit')}
			<a href="/offenses/{o.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/offenses" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Offense Information</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Applicant:</strong>
					{#if o.applicantUuid}
						<a href="/applicants/{o.applicantUuid}">{o.applicantName}</a>
					{:else}
						{o.applicantName || '-'}
					{/if}
				</p>
				<p><strong>Officer:</strong> {o.officerName || '-'}</p>
				<p><strong>Date:</strong> {o.offenseDate || '-'}</p>
				<p><strong>Station:</strong> {o.rangeName || '-'}</p>
			</div>
			<div>
				<p><strong>Illegal Wildlife:</strong> {o.illegalWildlife || '-'}</p>
				<p><strong>Reason Confiscated:</strong> {o.reasonConfiscated || '-'}</p>
				<p><strong>Hand Tame:</strong> {o.handTame ? 'Yes' : 'No'}</p>
				<p><strong>Prior History:</strong> {o.priorHistory ? 'Yes' : 'No'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Cage & Signatures</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<p><strong>Cage Size:</strong> {o.cageSizeFeet || '-'} ft</p>
				<p><strong>Cage Location:</strong> {o.cageLocation || '-'}</p>
				<p><strong>Cage Confiscated:</strong> {o.cageConfiscated ? 'Yes' : 'No'}</p>
			</div>
			<div>
				<p><strong>Signed by Officer:</strong> {o.signedOfficer ? 'Yes' : 'No'}</p>
				<p><strong>Signed by Offender:</strong> {o.signedOffender ? 'Yes' : 'No'}</p>
				<p><strong>Signed Date:</strong> {o.signedDate || '-'}</p>
			</div>
		</div>
	</div>
</div>

{#if o.healthIssues || o.dietNotes || o.offenseComments}
	<div class="card">
		<div class="card-header">Additional Details</div>
		<div class="card-body">
			{#if o.healthIssues}
				<p><strong>Health Issues:</strong> {o.healthIssues}</p>
			{/if}
			{#if o.dietNotes}
				<p><strong>Diet Notes:</strong> {o.dietNotes}</p>
			{/if}
			{#if o.offenseComments}
				<p><strong>Comments:</strong> {o.offenseComments}</p>
			{/if}
		</div>
	</div>
{/if}
