<script lang="ts">
	import { onMount } from 'svelte';
	import { CURRENCIES, type Currency, type GetMoneyResponse } from '$lib/models';

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
	let map; // Declare a variable to hold the map instance
	let marker; // Declare a variable to hold the marker instance

	onMount(() => {
		// Initialize the map
		map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

		// Add OpenStreetMap tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	});

	async function onSubmit() {
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

		// Set the map view to the new coordinates
		map.setView([latitude, longitude], 13); // Adjust zoom level as needed

		// Add a marker at the new coordinates
		if (marker) {
			marker.setLatLng([latitude, longitude]); // Move existing marker
		} else {
			marker = L.marker([latitude, longitude]).addTo(map) // Add new marker
				.bindPopup('Location: ' + address)
				.openPopup();
		}

		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				currencyOfMonth,
				time: timeInMinutes,
				bill: bill * +billPeriod,
				latitude,
				longitude,
				rating,
			}),
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

<style>
	article {
		max-width: 600px;
		margin: 2rem auto;
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

	input, select {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
	}

	input:focus, select:focus {
		outline: none;
		border-color: #4A90E2;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	button {
		background-color: #4A90E2;
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
		background-color: #357ABD;
	}

	.error {
		color: #DC3545;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	h3 {
		color: #2C3E50;
		margin: 0;
	}

	strong {
		color: #2C3E50;
		display: block;
		margin-bottom: 0.5rem;
	}

	p {
		margin: 0;
		font-size: 1.1rem;
	}
</style>

<article>
	<form on:submit|preventDefault={onSubmit}>
		<label>
			Address *
			<input type="text" name="address" placeholder="Address" bind:value={address} required />
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

{#if moneyValue !== undefined}
	<article>
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
