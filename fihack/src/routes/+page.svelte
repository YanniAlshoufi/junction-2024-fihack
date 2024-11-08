<script lang="ts">
	import { CURRENCIES, type Currency, type GetMoneyResponse } from '$lib/models';

	const url =
		'https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json';

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

<article>
	<form onsubmit={onSubmit}>
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
		<p style="color: red">{errorStr}</p>
	{/if}
</article>

{#if moneyValue !== undefined}
	<article>
		<header>
			<h3>Results</h3>
		</header>
		<div class="grid">
			<div>
				<strong>Value:</strong>
				<p>{moneyValue.toFixed(2)} {currencyOfMoneyValue}</p>
			</div>
			<div>
				<strong>Efficiency:</strong>
				<p>{(effeciency! * 100).toFixed(2)}%</p>
			</div>
		</div>
	</article>
{/if}
