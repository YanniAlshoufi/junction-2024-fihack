<script lang="ts">
	const { children } = $props();
</script>

<header class="container">
	<nav>
		<ul>
			<li>Home</li>
		</ul>
		<ul>
			<li>Fihack</li>
		</ul>
	</nav>
</header>

<main class="container">
	{@render children()}
</main>
