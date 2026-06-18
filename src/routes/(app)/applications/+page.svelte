<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);

	const STATUSES = ['Pending', 'Approved', 'Denied', 'Permit Awarded'];

	function statusBadge(status: string | null) {
		if (!status) return 'badge-gray';
		if (status === 'Approved' || status === 'Permit Awarded') return 'badge-green';
		if (status === 'Pending') return 'badge-blue';
		if (status === 'Denied') return 'badge-red';
		return 'badge-gray';
	}
</script>

<svelte:head><title>Applications | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Applications ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'applications-add')}
		<a href="/applications/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Application</a>
	{/if}
</div>

<div class="card" style="margin-bottom:20px;">
	<div class="card-body">
		<form method="GET" style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
			<select class="form-select" name="status" style="width:auto;">
				<option value="">All Statuses</option>
				{#each STATUSES as s}
					<option value={s} selected={data.status === s}>{s}</option>
				{/each}
			</select>
			<button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Filter</button>
			<a href="/applications" class="btn btn-outline">Clear</a>
		</form>
	</div>
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Application ID</th>
					<th>Applicant</th>
					<th>Status</th>
					<th>Application Date</th>
					<th>Station</th>
					<th>Signed</th>
				</tr>
			</thead>
			<tbody>
				{#each data.applications as app}
					<tr class="clickable" ondblclick={() => goto(`/applications/${app.uuid}`)}>
						<td><a href="/applications/{app.uuid}">{app.eriApplicationId || '-'}</a></td>
						<td>
							{#if app.applicantUuid}
								<a href="/applicants/{app.applicantUuid}">{app.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td><span class="badge {statusBadge(app.status)}">{app.status || '-'}</span></td>
						<td>{app.applicationDate || '-'}</td>
						<td>{app.rangeName || '-'}</td>
						<td>{app.applicationSigned ? 'Yes' : 'No'}</td>
					</tr>
				{:else}
					<tr><td colspan="6" style="text-align:center;color:var(--gray-600);padding:40px;">No applications found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/applications?status={data.status}" />
