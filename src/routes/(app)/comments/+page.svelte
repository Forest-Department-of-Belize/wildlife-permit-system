<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { hasPermission } from '$lib/utils/permissions';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><title>Comments | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Comments ({data.total})</h1>
	{#if user && hasPermission(user.permissions, 'comments-add')}
		<a href="/comments/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Comment</a>
	{/if}
</div>

<div class="card">
	<div class="card-body" style="overflow-x:auto;">
		<table>
			<thead>
				<tr>
					<th>Comment ID</th>
					<th>Applicant</th>
					<th>Date</th>
					<th>Comment</th>
				</tr>
			</thead>
			<tbody>
				{#each data.comments as c}
					<tr class="clickable" ondblclick={() => goto(`/comments/${c.uuid}`)}>
						<td><a href="/comments/{c.uuid}">{c.eriCommentId || '-'}</a></td>
						<td>
							{#if c.applicantUuid}
								<a href="/applicants/{c.applicantUuid}">{c.applicantName}</a>
							{:else}
								-
							{/if}
						</td>
						<td>{c.commentDate || '-'}</td>
						<td>{c.commentComments?.slice(0, 80) || '-'}</td>
					</tr>
				{:else}
					<tr><td colspan="4" style="text-align:center;color:var(--gray-600);padding:40px;">No comments found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Pagination page={data.page} totalPages={data.totalPages} baseUrl="/comments?" />
