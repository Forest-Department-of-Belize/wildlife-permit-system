<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Offenses | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Offenses ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'offenses-add')}
		<a href="/offenses/create" class="btn btn-primary"><i class="fas fa-plus"></i> Log Offense</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Applicant</th>
					<th>Officer</th>
					<th>Illegal Wildlife</th>
					<th>Hand Tame</th>
					<th>Cage Confiscated</th>
					<th>Range</th>
					<th>Comments</th>
				</tr>
			</thead>
			<tbody>
				{#each data.offenses as o}
					<tr class="clickable" ondblclick={() => goto(`/offenses/${o.uuid}`)}>
						<td><a href="/offenses/{o.uuid}">{o.offenseDate || '-'}</a></td>
						<td>
							{#if o.applicantUuid}
								<a href="/applicants/{o.applicantUuid}">{o.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td>{o.officerName || '-'}</td>
						<td>{o.illegalWildlife?.slice(0, 40) || '-'}</td>
						<td>{o.handTame ? 'Yes' : 'No'}</td>
						<td><span class="badge" class:badge-red={o.cageConfiscated} class:badge-green={!o.cageConfiscated}>{o.cageConfiscated ? 'Yes' : 'No'}</span></td>
						<td>{o.rangeName || '-'}</td>
						<td>{o.offenseComments?.slice(0, 60) || '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="8" style="text-align:center;color:var(--gray-600);padding:40px;">No offenses found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/offenses?" />
