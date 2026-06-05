<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';

	let { data } = $props();
	const stats = $derived(data.stats);
	const recent = $derived(data.recentInspections);
</script>

<svelte:head><title>Dashboard | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">Dashboard</h1>
</div>

<div class="grid grid-4" style="margin-bottom:25px;">
	<StatCard icon="fa-users" value={stats.applicants} label="Total Applicants" color="#2E7D32" />
	<StatCard icon="fa-file-alt" value={stats.activePermits} label="Active Permits" color="#1565C0" />
	<StatCard icon="fa-search" value={stats.pendingInspections} label="Pending Inspections" color="#F57F17" />
	<StatCard icon="fa-dove" value={stats.confiscatedParrots} label="Confiscated Parrots" color="#C62828" />
</div>

<div class="grid grid-2">
	<div class="card">
		<div class="card-header">Recent Inspections</div>
		<div class="card-body">
			{#if recent && recent.length > 0}
				<table>
					<thead>
						<tr><th>Date</th><th>Applicant</th><th>Inspector</th><th>Status</th></tr>
					</thead>
					<tbody>
						{#each recent as inspection}
							<tr>
								<td>{inspection.inspection_date ?? '-'}</td>
								<td>
									{#if inspection.applicant_uuid}
										<a href="/applicants/{inspection.applicant_uuid}">{inspection.applicant_name}</a>
									{:else}
										{inspection.applicant_name ?? '-'}
									{/if}
								</td>
								<td>{inspection.inspector_name ?? '-'}</td>
								<td>
									<span class="badge" class:badge-green={inspection.inspection_status === 'completed'} class:badge-yellow={inspection.inspection_status === 'scheduled'}>
										{inspection.inspection_status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p style="color:var(--gray-600);">No recent inspections.</p>
			{/if}
		</div>
	</div>

	<div class="card">
		<div class="card-header">Quick Actions</div>
		<div class="card-body" style="display:flex;flex-direction:column;gap:10px;">
			<a href="/applicants/create" class="btn btn-primary"><i class="fas fa-plus"></i> New Applicant</a>
			<a href="/permits/create" class="btn btn-outline"><i class="fas fa-plus"></i> New Permit</a>
			<a href="/inspections/create" class="btn btn-outline"><i class="fas fa-plus"></i> New Inspection</a>
			<a href="/calls/create" class="btn btn-outline"><i class="fas fa-plus"></i> Log Call</a>
		</div>
	</div>
</div>
