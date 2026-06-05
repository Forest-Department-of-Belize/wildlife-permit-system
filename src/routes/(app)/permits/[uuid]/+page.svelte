<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';

	let { data } = $props();
	const user = $derived(data.user);
	const p = $derived(data.permit);

	function statusBadge(status: string | null) {
		if (!status) return 'badge-gray';
		if (status === 'Active') return 'badge-green';
		if (status === 'Processing') return 'badge-blue';
		if (status === 'Expired' || status === 'Revoked') return 'badge-red';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Permit {p.permitNumber || p.uuid} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Permit {p.permitNumber || ''}</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'permits-edit')}
			<a href="/permits/{p.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/permits" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
		<span class="badge {statusBadge(p.status)}" style="font-size:14px;">{p.status || 'Processing'}</span>
		{#if p.permitNumber}
			<span style="color:var(--gray-600);">Permit # {p.permitNumber}</span>
		{/if}
		{#if p.referenceNumber}
			<span style="color:var(--gray-600);">Ref # {p.referenceNumber}</span>
		{/if}
	</div>
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-header">Permit Information</div>
	<div class="card-body">
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Details</h4>
				<p><strong>Applicant:</strong>
					{#if p.applicantUuid}
						<a href="/applicants/{p.applicantUuid}">{p.applicantName}</a>
					{:else}
						-
					{/if}
				</p>
				<p><strong>Station / Range:</strong> {p.rangeName || '-'}</p>
				<p><strong>Information Source:</strong> {p.infoSource || '-'}</p>
				<p><strong>Number of Pets:</strong> {p.numberOfPets}</p>
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Dates</h4>
				<p><strong>Application Date:</strong> {p.applicationDate || '-'}</p>
				<p><strong>Issue Date:</strong> {p.issueDate || '-'}</p>
				<p><strong>Created:</strong> {p.createdAt || '-'}</p>
				<p><strong>Last Updated:</strong> {p.updatedAt || '-'}</p>
			</div>
		</div>
		<hr style="margin:20px 0;border-color:var(--gray-100);" />
		<div class="grid grid-2">
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Housing</h4>
				<p>{p.housing || '-'}</p>
			</div>
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Picture</h4>
				{#if p.pictureUrl}
					<a href={p.pictureUrl} target="_blank">{p.pictureUrl}</a>
				{:else}
					<p>-</p>
				{/if}
			</div>
		</div>
		{#if p.permitComments}
			<hr style="margin:20px 0;border-color:var(--gray-100);" />
			<div>
				<h4 style="margin-bottom:12px;color:var(--green-900);">Comments</h4>
				<p>{p.permitComments}</p>
			</div>
		{/if}
	</div>
</div>
