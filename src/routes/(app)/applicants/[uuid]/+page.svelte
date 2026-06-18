<script lang="ts">
	import { hasPermission } from '$lib/utils/permissions';
	let { data } = $props();
	const user = $derived(data.user);
	const a = $derived(data.applicant);
	let activeTab = $state('details');

	const PROCESS_STATUSES = [
		'Pending Call', 'Called', 'Inspection Booked', 'Inspection Done',
		'Pending Compliance', 'Approved Awaiting Banding', 'Approved'
	];
</script>

<svelte:head><title>{a.firstName} {a.lastName} | Wildlife Permit System</title></svelte:head>

<div class="page-header">
	<h1 class="page-title">{a.firstName} {a.middleName || ''} {a.lastName}</h1>
	<div style="display:flex;gap:8px;">
		{#if user && hasPermission(user.permissions, 'applicants-edit')}
			<a href="/applicants/{a.uuid}/edit" class="btn btn-outline"><i class="fas fa-edit"></i> Edit</a>
		{/if}
		<a href="/applicants" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back</a>
	</div>
</div>

<!-- Status bar -->
<div class="card" style="margin-bottom:20px;">
	<div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
		<span class="badge badge-blue" style="font-size:14px;">{a.processStatus || 'Pending Call'}</span>
		{#if user && hasPermission(user.permissions, 'applicants-edit')}
			<form method="POST" action="?/updateStatus" style="display:flex;gap:8px;align-items:center;">
				<select class="form-select" name="process_status" style="width:auto;">
					{#each PROCESS_STATUSES as s}
						<option value={s} selected={a.processStatus === s}>{s}</option>
					{/each}
				</select>
				<button type="submit" class="btn btn-sm btn-primary">Update</button>
			</form>
		{/if}
	</div>
</div>

<!-- Tabs -->
<div class="tabs">
	<button class="tab" class:active={activeTab === 'details'} onclick={() => activeTab = 'details'}>Details</button>
	<button class="tab" class:active={activeTab === 'parrots'} onclick={() => activeTab = 'parrots'}>Parrots ({data.parrots.length})</button>
	<button class="tab" class:active={activeTab === 'permits'} onclick={() => activeTab = 'permits'}>Permits ({data.permits.length})</button>
	<button class="tab" class:active={activeTab === 'inspections'} onclick={() => activeTab = 'inspections'}>Inspections ({data.inspections.length})</button>
	<button class="tab" class:active={activeTab === 'calls'} onclick={() => activeTab = 'calls'}>Calls ({data.calls.length})</button>
	<button class="tab" class:active={activeTab === 'offenses'} onclick={() => activeTab = 'offenses'}>Offenses ({data.offenses.length})</button>
	<button class="tab" class:active={activeTab === 'notes'} onclick={() => activeTab = 'notes'}>Notes</button>
</div>

{#if activeTab === 'details'}
	<div class="card">
		<div class="card-body">
			<div class="grid grid-2">
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Personal</h4>
					<p><strong>Date of Birth:</strong> {a.dateOfBirth || '-'}</p>
					<p><strong>ID:</strong> {a.governmentIdType || '-'} {a.governmentIdNumber || ''}</p>
					<p><strong>Occupation:</strong> {a.occupation || '-'}</p>
					<p><strong>Company:</strong> {a.company || '-'}</p>
				</div>
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Contact</h4>
					<p><strong>Phone:</strong> {a.contactNumber || '-'} {a.contactNumberWhatsapp ? '(WhatsApp)' : ''}</p>
					<p><strong>Secondary:</strong> {a.contactSecondary || '-'}</p>
					<p><strong>Email:</strong> {a.email || '-'}</p>
					<p><strong>Address:</strong> {a.address1 || '-'} {a.address2 || ''}</p>
					<p><strong>District:</strong> {a.districtName || '-'}</p>
				</div>
			</div>
			<hr style="margin:20px 0;border-color:var(--gray-100);" />
			<div class="grid grid-2">
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Housing</h4>
					<p><strong>Enclosure:</strong> {a.enclosureType || '-'}</p>
					<p><strong>Location:</strong> {a.cageLocation || '-'}</p>
					<p><strong>Size:</strong> {a.cageSizeFeet || '-'} ft</p>
					<p><strong>Flies Free:</strong> {a.doesFlyFree ? 'Yes' : 'No'}</p>
					<p><strong>Wings Cut:</strong> {a.areWingsCut ? 'Yes' : 'No'}</p>
				</div>
				<div>
					<h4 style="margin-bottom:12px;color:var(--green-900);">Diet</h4>
					<p>{a.parrotDiet || '-'}</p>
				</div>
			</div>
		</div>
	</div>
{:else if activeTab === 'parrots'}
	<div class="card">
		<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
			<span>Parrots</span>
			{#if user && hasPermission(user.permissions, 'parrots-add')}
				<a href="/parrots/create?applicant={a.id}" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Add</a>
			{/if}
		</div>
		<div class="card-body" style="overflow-x:auto;">
			<table>
				<thead><tr><th>Species</th><th>Name</th><th>Band #</th><th>Sex</th><th>Healthy</th><th>Confiscated</th></tr></thead>
				<tbody>
					{#each data.parrots as p}
						<tr class="clickable" ondblclick={() => window.location.href = `/parrots/${p.uuid}`}>
							<td>{p.speciesName || '-'}</td>
							<td><a href="/parrots/{p.uuid}">{p.petName || '-'}</a></td>
							<td>{p.bandNumber || '-'}</td>
							<td>{p.sex || '-'}</td>
							<td>{p.isHealthy ? 'Yes' : 'No'}</td>
							<td>{p.confiscated ? 'Yes' : 'No'}</td>
						</tr>
					{:else}
						<tr><td colspan="6" style="text-align:center;color:var(--gray-600);">No parrots recorded.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if activeTab === 'permits'}
	<div class="card">
		<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
			<span>Permits</span>
			{#if user && hasPermission(user.permissions, 'permits-add')}
				<a href="/permits/create?applicant={a.id}" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Add</a>
			{/if}
		</div>
		<div class="card-body" style="overflow-x:auto;">
			<table>
				<thead><tr><th>Permit #</th><th>Status</th><th>Issue Date</th><th>Pets</th><th>Station</th></tr></thead>
				<tbody>
					{#each data.permits as p}
						<tr class="clickable" ondblclick={() => window.location.href = `/permits/${p.uuid}`}>
							<td><a href="/permits/{p.uuid}">{p.permitNumber || '-'}</a></td>
							<td><span class="badge" class:badge-green={p.status === 'Active'} class:badge-blue={p.status === 'Processing'} class:badge-red={p.status === 'Expired' || p.status === 'Revoked'}>{p.status}</span></td>
							<td>{p.issueDate || '-'}</td>
							<td>{p.numberOfPets}</td>
							<td>{p.rangeName || '-'}</td>
						</tr>
					{:else}
						<tr><td colspan="5" style="text-align:center;color:var(--gray-600);">No permits.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if activeTab === 'inspections'}
	<div class="card">
		<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
			<span>Inspections</span>
			{#if user && hasPermission(user.permissions, 'inspections-add')}
				<a href="/inspections/create?applicant={a.id}" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Add</a>
			{/if}
		</div>
		<div class="card-body" style="overflow-x:auto;">
			<table>
				<thead><tr><th>Date</th><th>Inspector</th><th>Status</th><th>Notes</th></tr></thead>
				<tbody>
					{#each data.inspections as i}
						<tr class="clickable" ondblclick={() => window.location.href = `/inspections/${i.uuid}`}>
							<td><a href="/inspections/{i.uuid}">{i.inspectionDate || '-'}</a></td>
							<td>{i.inspectorName || '-'}</td>
							<td><span class="badge" class:badge-green={i.inspectionStatus === 'completed'} class:badge-yellow={i.inspectionStatus === 'scheduled'}>{i.inspectionStatus}</span></td>
							<td>{i.notes?.slice(0, 80) || '-'}</td>
						</tr>
					{:else}
						<tr><td colspan="4" style="text-align:center;color:var(--gray-600);">No inspections.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if activeTab === 'calls'}
	<div class="card">
		<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
			<span>Call Log</span>
			{#if user && hasPermission(user.permissions, 'calls-add')}
				<a href="/calls/create?applicant={a.id}" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Log Call</a>
			{/if}
		</div>
		<div class="card-body" style="overflow-x:auto;">
			<table>
				<thead><tr><th>Date</th><th>Officer</th><th>Answered</th><th>Completed</th><th>Comments</th></tr></thead>
				<tbody>
					{#each data.calls as c}
						<tr class="clickable" ondblclick={() => window.location.href = `/calls/${c.uuid}`}>
							<td><a href="/calls/{c.uuid}">{c.callDate || '-'}</a></td>
							<td>{c.officerName || '-'}</td>
							<td>{c.isAnswered ? 'Yes' : 'No'}</td>
							<td>{c.isFullyCompleted ? 'Yes' : 'No'}</td>
							<td>{c.callComments?.slice(0, 60) || '-'}</td>
						</tr>
					{:else}
						<tr><td colspan="5" style="text-align:center;color:var(--gray-600);">No calls logged.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if activeTab === 'offenses'}
	<div class="card">
		<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
			<span>Offenses</span>
			{#if user && hasPermission(user.permissions, 'offenses-add')}
				<a href="/offenses/create?applicant={a.id}" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Log Offense</a>
			{/if}
		</div>
		<div class="card-body" style="overflow-x:auto;">
			<table>
				<thead><tr><th>Date</th><th>Officer</th><th>Wildlife</th><th>Cage Confiscated</th></tr></thead>
				<tbody>
					{#each data.offenses as o}
						<tr class="clickable" ondblclick={() => window.location.href = `/offenses/${o.uuid}`}>
							<td><a href="/offenses/{o.uuid}">{o.offenseDate || '-'}</a></td>
							<td>{o.officerName || '-'}</td>
							<td>{o.illegalWildlife?.slice(0, 60) || '-'}</td>
							<td>{o.cageConfiscated ? 'Yes' : 'No'}</td>
						</tr>
					{:else}
						<tr><td colspan="4" style="text-align:center;color:var(--gray-600);">No offenses recorded.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if activeTab === 'notes'}
	<div class="card">
		<div class="card-header">Internal Notes</div>
		<div class="card-body">
			<form method="POST" action="?/updateNotes">
				<div class="form-group">
					<textarea class="form-textarea" name="applicant_notes" rows="8">{a.applicantNotes || ''}</textarea>
				</div>
				<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Notes</button>
			</form>
		</div>
	</div>
{/if}

{#if user && hasPermission(user.permissions, 'applicants-delete')}
	<div style="margin-top:40px;padding-top:20px;border-top:1px solid var(--gray-200);">
		<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('Delete this applicant? This cannot be undone.')) e.preventDefault(); }}>
			<button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Delete Applicant</button>
		</form>
	</div>
{/if}
