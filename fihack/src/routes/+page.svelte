<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

	
		<input type="text" id="address" placeholder="Enter address" />
		<button on:click={geocodeAddress()}>Get Coordinates</button>
		<p id="output"></p>

		<script>
			function geocodeAddress() {
				const address = document.getElementById('address').value;
				const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						if (data && data.length > 0) {
							const latitude = data[0].lat;
							const longitude = data[0].lon;
							document.getElementById('output').innerText =
								`Latitude: ${latitude}, Longitude: ${longitude}`;
						} else {
							document.getElementById('output').innerText = 'Address not found!';
						}
					})
					.catch((error) => {
						console.error('Error:', error);
						document.getElementById('output').innerText = 'An error occurred.';
					});
			}
		</script>
	
