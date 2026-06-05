<script lang="ts">
	let { icon = '', value = 0, label = '', color = '#2E7D32' }: { icon?: string; value?: number; label?: string; color?: string } = $props();
</script>

<div class="stat-card">
	<div class="stat-icon" style="background:{color}">
		<i class="fas {icon}"></i>
	</div>
	<div class="stat-info">
		<h3>{value}</h3>
		<p>{label}</p>
	</div>
</div>
