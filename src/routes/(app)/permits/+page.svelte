<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);

	const STATUSES = ['Processing', 'Active', 'Expired', 'Revoked'];

	function statusBadge(status: string | null) {
		if (!status) return 'badge-gray';
		if (status === 'Active') return 'badge-green';
		if (status === 'Processing') return 'badge-blue';
		if (status === 'Expired' || status === 'Revoked') return 'badge-red';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Permits | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Permits ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'permits-add')}
		<a href="/permits/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Permit</a>
	{/if}
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body">
		<form method="GET" style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
			<div class="form-group" style="flex:1;min-width:200px;margin-bottom:0;">
				<input class="form-input" type="text" name="search" placeholder="Search by permit #, reference #..." value={data.search} />
			</div>
			<select class="form-select" name="status" style="width:auto;">
				<option value="">All Statuses</option>
				{#each STATUSES as s}
					<option value={s} selected={data.status === s}>{s}</option>
				{/each}
			</select>
			<button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Search</button>
			<a href="/permits" class="btn btn-outline">Clear</a>
		</form>
	</div>
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Permit #</th>
					<th>Reference #</th>
					<th>Applicant</th>
					<th>Status</th>
					<th>Application Date</th>
					<th>Issue Date</th>
					<th>Pets</th>
					<th>Station</th>
				</tr>
			</thead>
			<tbody>
				{#each data.permits as p}
					<tr class="clickable" ondblclick={() => goto(`/permits/${p.uuid}`)}>
						<td><a href="/permits/{p.uuid}">{p.permitNumber || '-'}</a></td>
						<td>{p.referenceNumber || '-'}</td>
						<td>
							{#if p.applicantUuid}
								<a href="/applicants/{p.applicantUuid}">{p.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td><span class="badge {statusBadge(p.status)}">{p.status || '-'}</span></td>
						<td>{p.applicationDate || '-'}</td>
						<td>{p.issueDate || '-'}</td>
						<td>{p.numberOfPets}</td>
						<td>{p.rangeName || '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="8" style="text-align:center;color:var(--gray-600);padding:40px;">No permits found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/permits?search={data.search}&status={data.status}" />
