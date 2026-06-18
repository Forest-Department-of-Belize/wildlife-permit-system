<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';
	let { data } = $props();
	const user = $derived(data.user);
	const p = $derived(data.parrot);
</script>

<svelte:head><title>{p.petName || 'Parrot'} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">{p.petName || 'Unnamed Parrot'}</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'parrots-edit')}
			<a href="/parrots/{p.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/parrots" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Parrot Details</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Identity</h4>
				<p><strong>Pet Name:</strong> {p.petName || '-'}</p>
				<p><strong>Species:</strong> {p.speciesName || '-'}</p>
				<p><strong>Band Number:</strong> {p.bandNumber || '-'}</p>
				<p><strong>Banded:</strong> {p.banded ? 'Yes' : 'No'}</p>
				<p><strong>Sex:</strong> {p.sex || '-'}</p>
				<p><strong>Age:</strong> {p.parrotAgeMonths != null ? `${p.parrotAgeMonths} months` : '-'}</p>
				<p><strong>Status:</strong> {p.parrotStatus || '-'}</p>
				<p><strong>End Date:</strong> {p.endDate || '-'}</p>
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Ownership</h4>
				<p><strong>Applicant:</strong>
					{#if p.applicantUuid}
						<a href="/applicants/{p.applicantUuid}">{p.applicantName}</a>
					{:else}
						-
					{/if}
				</p>
				<p><strong>Method Obtained:</strong> {p.methodObtained || '-'}</p>
				<p><strong>Ownership Period:</strong> {p.periodOfOwnershipMonths != null ? `${p.periodOfOwnershipMonths} months` : '-'}</p>
				<p><strong>Info Source:</strong> {p.infoSource || '-'}</p>
				<p><strong>Town Obtained:</strong> {p.townObtained || '-'}</p>
				<p><strong>District Obtained:</strong> {p.districtObtain || '-'}</p>
				<p><strong>Period of Ownership:</strong> {p.periodOfOwnership || '-'}</p>
				<p><strong>Date Period Provided:</strong> {p.datePeriodProvided || '-'}</p>
				<p><strong>Species Description by Applicant:</strong> {p.speciesDescripByApplicant || '-'}</p>
				<p><strong>Application ID:</strong> {p.eriApplicationId || '-'}</p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Housing & Health</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Housing</h4>
				<p><strong>Housing Details:</strong> {p.housingDetails || '-'}</p>
				<p><strong>Has Parrot:</strong> {p.hasParrot ? 'Yes' : 'No'}</p>
				{#if !p.hasParrot}
					<p><strong>Why No Parrot:</strong> {p.whyNoParrot || '-'}</p>
					<p><strong>When No Parrot:</strong> {p.whenNoParrot || '-'}</p>
					<p><strong>Where No Parrot:</strong> {p.whereNoParrot || '-'}</p>
					<p><strong>Date Loss Info Provided:</strong> {p.dateParrotLossInfoProvided || '-'}</p>
					<p><strong>New Owner:</strong> {p.newOwner || '-'}</p>
					<p><strong>New Owner Address:</strong> {p.newOwnerAddress || '-'}</p>
					<p><strong>New Owner Contact:</strong> {p.newOwnerContact || '-'}</p>
				{/if}
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Health</h4>
				<p><strong>Healthy:</strong> <span class="badge" class:badge-green={p.isHealthy} class:badge-red={!p.isHealthy}>{p.isHealthy ? 'Yes' : 'No'}</span></p>
				<p><strong>Health Comments:</strong> {p.healthComments || '-'}</p>
				<p><strong>Professional Health Comments:</strong> {p.healthCommsByProfessional || '-'}</p>
				<p><strong>Confiscated:</strong> <span class="badge" class:badge-red={p.confiscated} class:badge-green={!p.confiscated}>{p.confiscated ? 'Yes' : 'No'}</span></p>
			</div>
		</div>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Additional Information</div>
	<div class="card-body">
		{#if p.stories}
			<p><strong>Stories:</strong> {p.stories}</p>
		{/if}
		{#if p.birdComments}
			<p><strong>Bird Comments:</strong> {p.birdComments}</p>
		{/if}
		<p><strong>Sex Justification:</strong> {p.justificationSexByApplicant || '-'}</p>
		<p><strong>Age Description:</strong> {p.parrotAgeDescription || '-'}</p>
		<p><strong>Date Age Described:</strong> {p.dateParrotAgeDescribed || '-'}</p>
		<p><strong>Has Picture:</strong> {p.parrotPicture ? 'Yes' : 'No'}</p>
	</div>
</div>

{#if user && hasPermission(user.permissions, 'parrots-delete')}
	<div style="margin-top:40px;padding-top:20px;border-top:1px solid var(--gray-200);">
		<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('Delete this parrot? This cannot be undone.')) e.preventDefault(); }}>
			<button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Delete Parrot</button>
		</form>
	</div>
{/if}
