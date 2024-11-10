<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<div>
	{@render children()}
</div>

<style>
	body {
		background: #e8e5e5;
	}
</style>
