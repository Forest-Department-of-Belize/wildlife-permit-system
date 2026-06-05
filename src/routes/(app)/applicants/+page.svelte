<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);

	const PROCESS_STATUSES = [
		'Pending Call', 'Called', 'Inspection Booked', 'Inspection Done',
		'Pending Compliance', 'Approved Awaiting Banding', 'Approved'
	];

	function statusBadge(status: string | null) {
		if (!status) return 'badge-gray';
		if (status === 'Approved') return 'badge-green';
		if (status.includes('Pending')) return 'badge-yellow';
		if (status.includes('Inspection')) return 'badge-blue';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Applicants | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Applicants ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'applicants-add')}
		<a href="/applicants/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Applicant</a>
	{/if}
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body">
		<form method="GET" style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
			<div class="form-group" style="flex:1;min-width:200px;margin-bottom:0;">
				<input class="form-input" type="text" name="search" placeholder="Search by name, phone, email..." value={data.search} />
			</div>
			<select class="form-select" name="status" style="width:auto;">
				<option value="">All Statuses</option>
				{#each PROCESS_STATUSES as s}
					<option value={s} selected={data.status === s}>{s}</option>
				{/each}
			</select>
			<select class="form-select" name="district" style="width:auto;">
				<option value="">All Districts</option>
				{#each data.districts as d}
					<option value={String(d.id)} selected={data.district === String(d.id)}>{d.name}</option>
				{/each}
			</select>
			<button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Search</button>
			<a href="/applicants" class="btn btn-outline">Clear</a>
		</form>
	</div>
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Contact</th>
					<th>District</th>
					<th>Status</th>
					<th>Parrots</th>
					<th>Permits</th>
				</tr>
			</thead>
			<tbody>
				{#each data.applicants as a}
					<tr class="clickable" ondblclick={() => goto(`/applicants/${a.uuid}`)}>
						<td><a href="/applicants/{a.uuid}">{a.lastName}, {a.firstName} {a.middleName || ''}</a></td>
						<td>{a.contactNumber || '-'}<br/><small style="color:var(--gray-600);">{a.email || ''}</small></td>
						<td>{a.districtName || '-'}</td>
						<td><span class="badge {statusBadge(a.processStatus)}">{a.processStatus || '-'}</span></td>
						<td>{a.parrotCount}</td>
						<td>{a.permitCount}</td>
					</tr>
				{:else}
					<tr><td colspan="6" style="text-align:center;color:var(--gray-600);padding:40px;">No applicants found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/applicants?search={data.search}&status={data.status}&district={data.district}" />
