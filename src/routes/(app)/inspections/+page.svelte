<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);

	const STATUSES = ['scheduled', 'completed'];

	function statusBadge(status: string | null) {
		if (status === 'completed') return 'badge-green';
		if (status === 'scheduled') return 'badge-yellow';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Inspections | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Inspections ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'inspections-add')}
		<a href="/inspections/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Inspection</a>
	{/if}
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body">
		<form method="GET" style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
			<select class="form-select" name="status" style="width:auto;">
				<option value="">All Statuses</option>
				{#each STATUSES as s}
					<option value={s} selected={data.status === s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
				{/each}
			</select>
			<button type="submit" class="btn btn-primary"><i class="fas fa-filter"></i> Filter</button>
			<a href="/inspections" class="btn btn-outline">Clear</a>
		</form>
	</div>
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Inspector</th>
					<th>Status</th>
					<th>Applicant</th>
					<th>Notes</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.inspections as i}
					<tr class="clickable" ondblclick={() => goto(`/inspections/${i.uuid}`)}>
						<td><a href="/inspections/{i.uuid}">{i.inspectionDate || '-'}</a></td>
						<td>{i.inspectorName || '-'}</td>
						<td><span class="badge {statusBadge(i.inspectionStatus)}">{i.inspectionStatus || '-'}</span></td>
						<td>
							{#if i.applicantUuid}
								<a href="/applicants/{i.applicantUuid}">{i.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td>{i.notes?.slice(0, 80) || '-'}</td>
						<td>{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="6" style="text-align:center;color:var(--gray-600);padding:40px;">No inspections found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/inspections?status={data.status}" />
