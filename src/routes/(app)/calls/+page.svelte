<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Calls | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Calls ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'calls-add')}
		<a href="/calls/create" class="btn btn-primary"><i class="fas fa-plus"></i> Log Call</a>
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
					<th>Number Called</th>
					<th>Language</th>
					<th>Answered</th>
					<th>Completed</th>
					<th>Comments</th>
				</tr>
			</thead>
			<tbody>
				{#each data.calls as c}
					<tr class="clickable" ondblclick={() => goto(`/calls/${c.uuid}`)}>
						<td><a href="/calls/{c.uuid}">{c.callDate || '-'}</a></td>
						<td>
							{#if c.applicantUuid}
								<a href="/applicants/{c.applicantUuid}">{c.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td>{c.officerName || '-'}</td>
						<td>{c.numberCalled || '-'}</td>
						<td>{c.language || '-'}</td>
						<td><span class="badge" class:badge-green={c.isAnswered} class:badge-red={!c.isAnswered}>{c.isAnswered ? 'Yes' : 'No'}</span></td>
						<td><span class="badge" class:badge-green={c.isFullyCompleted} class:badge-yellow={!c.isFullyCompleted}>{c.isFullyCompleted ? 'Yes' : 'No'}</span></td>
						<td>{c.callComments?.slice(0, 60) || '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="8" style="text-align:center;color:var(--gray-600);padding:40px;">No calls found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/calls?" />
