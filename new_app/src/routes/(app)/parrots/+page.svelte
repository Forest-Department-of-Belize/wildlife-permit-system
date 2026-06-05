<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);

	function healthBadge(isHealthy: boolean | null) {
		return isHealthy ? 'badge-green' : 'badge-red';
	}
</script>

<svelte:head><title>Parrots | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Parrots ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'parrots-add')}
		<a href="/parrots/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Parrot</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Pet Name</th>
					<th>Species</th>
					<th>Band #</th>
					<th>Sex</th>
					<th>Age (months)</th>
					<th>Healthy</th>
					<th>Confiscated</th>
					<th>Applicant</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.parrots as p}
					<tr class="clickable" ondblclick={() => goto(`/parrots/${p.uuid}`)}>
						<td><a href="/parrots/{p.uuid}">{p.petName || '-'}</a></td>
						<td>{p.speciesName || '-'}</td>
						<td>{p.bandNumber || '-'}</td>
						<td>{p.sex || '-'}</td>
						<td>{p.parrotAgeMonths ?? '-'}</td>
						<td><span class="badge {healthBadge(p.isHealthy)}">{p.isHealthy ? 'Yes' : 'No'}</span></td>
						<td>{p.confiscated ? 'Yes' : 'No'}</td>
						<td>
							{#if p.applicantUuid}
								<a href="/applicants/{p.applicantUuid}">{p.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="9" style="text-align:center;color:var(--gray-600);padding:40px;">No parrots found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/parrots" />
