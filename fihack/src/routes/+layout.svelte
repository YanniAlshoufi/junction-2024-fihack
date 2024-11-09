<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<div>
	{@render children()}
</div>
