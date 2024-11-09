<script lang="ts">
	import { onMount } from 'svelte';
	import { CURRENCIES, type Currency, type GetMoneyResponse } from '$lib/models';
	import L from 'leaflet';

	let address: string = $state('');
	let timeInMinutes: number | undefined = $state();
	let bill: number | undefined = $state();
	let billPeriod: string | undefined = $state();
	let rating: string | undefined = $state();
	let currencyOfMonth: Currency | undefined = $state();
	let moneyValue: number | undefined = $state();
	let currencyOfMoneyValue: string | undefined = $state();
	let effeciency: number | undefined = $state();
	let errorStr: string | undefined = $state();
	let map: L.Map | undefined;
	let marker: L.Marker | undefined;

	onMount(() => {
		map = L.map('map').setView([60.16207181470773, 24.904457261711535], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	});

	async function onSubmit(e: Event) {
		e.preventDefault();

		if (
			address === undefined ||
			timeInMinutes === undefined ||
			bill === undefined ||
			billPeriod === undefined ||
			rating === undefined ||
			currencyOfMonth === undefined
		) {
			errorStr = 'Please fill in all fields';
			return;
		}

		if (bill < 1) {
			errorStr = 'Bill must be greater than 0';
			return;
		}

		if (timeInMinutes < 1) {
			errorStr = 'Time must be greater than 0';
			return;
		}

		const [latitude, longitude] = await getCoordsFromAddress(address);

		map!.setView([latitude, longitude], 13);

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
				currencyOfMonth,
				time: timeInMinutes,
				bill: bill * +billPeriod,
				latitude,
				longitude,
				rating
			})
		});

		const data: GetMoneyResponse = await response.json();

		moneyValue = data.value;
		currencyOfMoneyValue = data.currency;
		effeciency = data.effeciency;
	}

	async function getCoordsFromAddress(address: string): Promise<[number, number]> {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

		let latitude = -1;
		let longitude = -1;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data && data.length > 0) {
				latitude = data[0].lat;
				longitude = data[0].lon;
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

<div class="container">
	<article>
		<form onsubmit={onSubmit}>
			<label>
				Address *
				<input
					type="text"
					name="address"
					placeholder="Address"
					bind:value={address}
					required
				/>
			</label>
			<label>
				Time (days) *
				<input
					type="number"
					name="time"
					placeholder="Time in days"
					bind:value={timeInMinutes}
					required
					min="1"
				/>
			</label>
			<label>
				Bill *
				<div class="grid">
					<input
						type="number"
						name="bill"
						placeholder="Bill"
						bind:value={bill}
						min="1"
						required
					/>
					<select name="period" bind:value={billPeriod} required>
						<option value="">Select period</option>
						<option value="1">per month</option>
						<option value="3">per quarter</option>
						<option value="12">per year</option>
					</select>
					<select name="currency-of-month" bind:value={currencyOfMonth} required>
						<option value="">Select currency</option>
						{#each CURRENCIES as currency}
							<option value={currency}>{currency} - {currency}</option>
						{/each}
					</select>
				</div>
			</label>
			<label>
				Rating *
				<select name="rating" bind:value={rating} required>
					<option value="">Select rating</option>
					<option value="A">A</option>
					<option value="B">B</option>
					<option value="C">C</option>
					<option value="D">D</option>
					<option value="E">E</option>
					<option value="F">F</option>
					<option value="G">G</option>
				</select>
			</label>
			<button>Submit</button>
		</form>

		{#if errorStr !== undefined}
			<p class="error">{errorStr}</p>
		{/if}
	</article>

	<div id="map"></div>
</div>

{#if moneyValue !== undefined}
	<article class="container">
		<header>
			<h3>Results</h3>
		</header>
		<div class="grid">
			<div class="result-item">
				<strong>Value:</strong>
				<p>{moneyValue.toFixed(2)} {currencyOfMoneyValue}</p>
			</div>
			<div class="result-item">
				<strong>Efficiency:</strong>
				<p>{(effeciency! * 100).toFixed(2)}%</p>
			</div>
		</div>
	</article>
{/if}

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 2rem auto;
	}

	#map {
		height: 100%;
		min-height: 400px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
		background-color: #4a90e2;
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
		background-color: #357abd;
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
