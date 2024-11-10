<script lang="ts">
	import { onMount } from 'svelte';
	import { type GetMoneyResponse } from '$lib/models';
	import L, { type LatLngLiteral } from 'leaflet';
	import { mockOverlayCoordinates } from '$lib/coords';

	let address: string = $state('');
	let bill: number | undefined = $state();
	let moneyValue: number | undefined = $state();
	let effeciency: number | undefined = $state();
	let errorStr: string | undefined = $state();
	let map: L.Map | undefined;
	let marker: L.Marker | undefined;
	let energyConsumption: number | undefined = $state();

	onMount(() => {
		map = L.map('map').setView([60.16207181470773, 24.904457261711535], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	});

	async function getBuildingFootprint() {
		const [latitude, longitude] = await getCoordsFromAddress(address);

		const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["building"](around:20,${latitude},${longitude});way["building"](around:20,${latitude},${longitude});relation["building"](around:20,${latitude},${longitude}););out body;`;

		try {
			const response = await fetch(overpassUrl);
			const data = await response.json();
			console.log('Overpass API Response:', data);

			const latlongs: L.LatLngExpression[] = mockOverlayCoordinates;

			L.imageOverlay('/src/shotwithheat.png', L.latLngBounds(latlongs)).addTo(map!);
			const markerBounds = L.latLngBounds([
				{ lat: latitude, lng: longitude } as LatLngLiteral
			]);

			if (marker) {
				marker.setLatLng([latitude, longitude - 0.00072]);
			} else {
				marker = L.marker([latitude, longitude])
					.addTo(map!)
					.bindPopup('Location: ' + address)
					.openPopup();
			}

			map!.fitBounds(markerBounds);
		} catch (error) {
			console.error('Error fetching building footprint:', error);
		}
	}

	async function onSubmit(e: Event) {
		e.preventDefault();
		await getBuildingFootprint();
		if (address === undefined || energyConsumption === undefined || bill === undefined) {
			errorStr = 'Please fill in all fields';
			return;
		}

		if (bill < 1) {
			errorStr = 'Bill must be greater than 0';
			return;
		}

		if (energyConsumption < 1) {
			errorStr = 'Energy consumption must be greater than 0';
			return;
		}

		let [latitude, longitude] = await getCoordsFromAddress(address);

		if (marker) {
			marker.setLatLng([latitude, longitude]);
		} else {
			marker = L.marker([latitude, longitude])
				.addTo(map!)
				.bindPopup('Location: ' + address)
				.openPopup();
		}

		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				bill,
				latitude,
				longitude,
				energyConsumption
			})
		});

		const data: GetMoneyResponse = await response.json();

		moneyValue = data.value;
		effeciency = data.effeciency;
	}

	async function getCoordsFromAddress(address: string): Promise<[number, number]> {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1&polygon_svg=1`;

		let latitude = -1;
		let longitude = -1;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data && data.length > 0) {
				latitude = 60.161943879348534;
				longitude = 24.904281711019397;

				errorStr = '';
			} else {
				errorStr = 'Address not found!';
			}
		} catch (error) {
			console.error('Error:', error);
			errorStr = 'An error occurred.';
		}

		return [latitude, longitude];
	}
</script>

<div class="header">
	<h1>RenovHeat</h1>
</div>

<div class="container">
	<article>
		<form onsubmit={onSubmit}>
			<label>
				Address *
				<input
					type="text"
					name="address"
					placeholder="Enter your address"
					bind:value={address}
					required
				/>
			</label>
			<label>
				Energy Consumption (kWh) *
				<input
					type="number"
					name="time"
					placeholder="Enter energy consumption"
					bind:value={energyConsumption}
					required
					min="1"
				/>
			</label>
			<label>
				Monthly bill *
				<div class="grid">
					<input
						type="number"
						name="bill"
						placeholder="Monthly bill"
						bind:value={bill}
						min="1"
						required
					/>
				</div>
			</label>
			<button>Calculate</button>
		</form>

		{#if errorStr !== undefined}
			<p class="error">{errorStr}</p>
		{/if}

		{#if moneyValue !== undefined}
			<h2>{moneyValue.toFixed(2)} saved per month</h2>
			<p>Your building efficiency is around {(effeciency! * 100).toFixed(2)}%</p>
		{/if}
	</article>

	<div id="map"></div>
</div>

<style>
	.header {
		height: 70px;
		position: sticky;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #efefef;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.container {
		height: 1000px;
		padding-top: 20px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		max-width: 1200px;

		margin: 0 auto;
	}

	#map {
		height: 100%;
		min-height: 400px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(71, 55, 55, 0.1);
	}

	article {
		max-width: 600px;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		background-color: white;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: 500;
	}

	input,
	select {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	button {
		background-color: #ed7327;
		color: white;
		padding: 1rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #d65b13;
	}

	.error {
		color: #dc3545;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	h3 {
		color: #2c3e50;
		margin: 0;
	}

	strong {
		color: #2c3e50;
		display: block;
		margin-bottom: 0.5rem;
	}

	p {
		margin: 0;
		font-size: 1.1rem;
	}
</style>
