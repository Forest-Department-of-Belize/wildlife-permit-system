<script lang="ts">
	import { page } from '$app/state';
	import Alert from '$lib/components/Alert.svelte';
	import { hasPermission, isAdmin, isAdminOrOIC } from '$lib/utils/permissions';

	let { children, data } = $props();
	let sidebarOpen = $state(false);

	const user = $derived(data.user);
	const flash = $derived(data.flash);
	const path = $derived(page.url.pathname);

	function isActive(prefix: string) {
		return path.startsWith(prefix) ? 'active' : '';
	}

	let inactivityTimer: ReturnType<typeof setTimeout>;
	function resetTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '/logout';
			document.body.appendChild(form);
			form.submit();
		}, 10 * 60 * 1000);
	}

	$effect(() => {
		const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
		events.forEach(e => document.addEventListener(e, resetTimer, true));
		resetTimer();
		return () => events.forEach(e => document.removeEventListener(e, resetTimer, true));
	});
</script>

<svelte:head><title>Wildlife Permit System</title></svelte:head>

<nav class="navbar">
	<a href="/dashboard" class="navbar-brand">
		<i class="fas fa-leaf"></i> Wildlife Permit System
	</a>
	<div class="navbar-right">
		{#if user}
			<span><i class="fas fa-map-marker-alt"></i> {user.rangeName || 'All Stations'}</span>
			<a href="/users/profile" class="btn btn-sm btn-outline" style="color:white;border-color:rgba(255,255,255,0.3);">
				<i class="fas fa-user"></i> {user.firstName} {user.lastName}
			</a>
			<form method="POST" action="/logout" style="display:inline;">
				<button type="submit" class="btn btn-sm btn-danger">
					<i class="fas fa-sign-out-alt"></i> Logout
				</button>
			</form>
		{/if}
		<button class="sidebar-toggle" onclick={() => sidebarOpen = !sidebarOpen}>
			<i class="fas fa-bars"></i>
		</button>
	</div>
</nav>

<div class="app-layout">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<aside class="sidebar" class:open={sidebarOpen} onclick={() => sidebarOpen = false}>
		<ul class="sidebar-menu">
			<li><a href="/dashboard" class={isActive('/dashboard')}><i class="fas fa-tachometer-alt"></i><span>Dashboard</span></a></li>
			<li class="menu-header">Records</li>
			<li><a href="/applicants" class={isActive('/applicants')}><i class="fas fa-users"></i><span>Applicants</span></a></li>
			<li><a href="/parrots" class={isActive('/parrots')}><i class="fas fa-dove"></i><span>Parrots</span></a></li>
			<li><a href="/applications" class={isActive('/applications')}><i class="fas fa-clipboard-list"></i><span>Applications</span></a></li>
			<li><a href="/permits" class={isActive('/permits')}><i class="fas fa-file-alt"></i><span>Permits</span></a></li>
			<li><a href="/inspections" class={isActive('/inspections')}><i class="fas fa-search"></i><span>Inspections</span></a></li>
			<li><a href="/calls" class={isActive('/calls')}><i class="fas fa-phone"></i><span>Calls</span></a></li>
			<li><a href="/offenses" class={isActive('/offenses')}><i class="fas fa-exclamation-triangle"></i><span>Offenses</span></a></li>
			<li><a href="/comments" class={isActive('/comments')}><i class="fas fa-comments"></i><span>Comments</span></a></li>

			{#if user && isAdminOrOIC(user.role)}
				<li class="menu-header">Administration</li>
				<li><a href="/species" class={isActive('/species')}><i class="fas fa-feather"></i><span>Species</span></a></li>
			{/if}

			{#if user && isAdmin(user.role)}
				<li><a href="/districts" class={isActive('/districts')}><i class="fas fa-map"></i><span>Districts</span></a></li>
				<li><a href="/ranges" class={isActive('/ranges')}><i class="fas fa-tree"></i><span>Forest Stations</span></a></li>
				<li><a href="/users" class={isActive('/users')}><i class="fas fa-user-cog"></i><span>Users</span></a></li>
				<li><a href="/import" class={isActive('/import')}><i class="fas fa-file-import"></i><span>Import Data</span></a></li>
			{/if}

			<li class="menu-header">Account</li>
			<li><a href="/users/profile"><i class="fas fa-user"></i><span>{user?.firstName} {user?.lastName}</span></a></li>
			<li>
				<form method="POST" action="/logout">
					<button type="submit" class="text-danger-sidebar" style="background:none;border:none;cursor:pointer;width:100%;text-align:left;padding:0;font:inherit;color:inherit;display:flex;align-items:center;gap:8px;">
						<i class="fas fa-sign-out-alt"></i><span>Logout</span>
					</button>
				</form>
			</li>
		</ul>
	</aside>

	<main class="main-content">
		{#if flash}
			<Alert type={flash.type} message={flash.message} />
		{/if}
		{@render children()}
	</main>
</div>
