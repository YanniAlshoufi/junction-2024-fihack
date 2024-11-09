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

	export const mockOverlayCoordinates: L.LatLngExpression[] = [
    [
        60.1613814,
        24.9029044
    ],
    [
        60.161448,
        24.9028621
    ],
    [
        60.1614413,
        24.9028193
    ],
    [
        60.1615143,
        24.902773
    ],
    [
        60.1615063,
        24.902722
    ],
    [
        60.1615324,
        24.9027054
    ],
    [
        60.1615845,
        24.9026723
    ],
    [
        60.1615726,
        24.9025962
    ],
    [
        60.1616456,
        24.9025498
    ],
    [
        60.161643,
        24.9025329
    ],
    [
        60.1616401,
        24.9025146
    ],
    [
        60.1617181,
        24.9024651
    ],
    [
        60.1617098,
        24.9024121
    ],
    [
        60.161772,
        24.9023725
    ],
    [
        60.1617687,
        24.9023511
    ],
    [
        60.1617673,
        24.9023427
    ],
    [
        60.1617649,
        24.9023274
    ],
    [
        60.1618265,
        24.9022884
    ],
    [
        60.1618192,
        24.9022422
    ],
    [
        60.1618786,
        24.9022045
    ],
    [
        60.1619346,
        24.9025611
    ],
    [
        60.1619415,
        24.9026045
    ],
    [
        60.1619484,
        24.9026485
    ],
    [
        60.1619918,
        24.9029246
    ],
    [
        60.1620428,
        24.9032493
    ],
    [
        60.1620894,
        24.9035458
    ],
    [
        60.1621049,
        24.9036448
    ],
    [
        60.162172,
        24.9040718
    ],
    [
        60.1621773,
        24.904105
    ],
    [
        60.1621823,
        24.9041372
    ],
    [
        60.1621871,
        24.9041678
    ],
    [
        60.1622397,
        24.9045023
    ],
    [
        60.162269,
        24.9046891
    ],
    [
        60.1622884,
        24.9048122
    ],
    [
        60.1623548,
        24.905235
    ],
    [
        60.1621667,
        24.9053544
    ],
    [
        60.1621564,
        24.905289
    ],
    [
        60.162114,
        24.9050187
    ],
    [
        60.1620959,
        24.9049041
    ],
    [
        60.1620603,
        24.904677
    ],
    [
        60.1620215,
        24.9044305
    ],
    [
        60.1619886,
        24.904221
    ],
    [
        60.1619406,
        24.9039158
    ],
    [
        60.1619279,
        24.9038345
    ],
    [
        60.1619167,
        24.9037636
    ],
    [
        60.1618105,
        24.9030874
    ],
    [
        60.1617813,
        24.9031059
    ],
    [
        60.161747,
        24.9031276
    ],
    [
        60.1616852,
        24.9031669
    ],
    [
        60.1616668,
        24.9031786
    ],
    [
        60.1617682,
        24.9038241
    ],
    [
        60.1617789,
        24.9038923
    ],
    [
        60.1617888,
        24.9039551
    ],
    [
        60.1618306,
        24.9042216
    ],
    [
        60.1618777,
        24.9045211
    ],
    [
        60.1619298,
        24.9048527
    ],
    [
        60.1620126,
        24.9053797
    ],
    [
        60.1620622,
        24.9056951
    ],
    [
        60.1620698,
        24.9057432
    ],
    [
        60.1620117,
        24.9057801
    ],
    [
        60.1619536,
        24.905817
    ],
    [
        60.1618495,
        24.905883
    ],
    [
        60.1618488,
        24.9058786
    ],
    [
        60.1618477,
        24.9058714
    ],
    [
        60.1618409,
        24.9058286
    ],
    [
        60.1618342,
        24.9057858
    ],
    [
        60.1618275,
        24.905743
    ],
    [
        60.1618207,
        24.9057001
    ],
    [
        60.161814,
        24.9056573
    ],
    [
        60.1618073,
        24.9056145
    ],
    [
        60.1618006,
        24.9055716
    ],
    [
        60.1617938,
        24.9055289
    ],
    [
        60.1617905,
        24.9055079
    ],
    [
        60.1617871,
        24.905486
    ],
    [
        60.1617804,
        24.9054432
    ],
    [
        60.1617736,
        24.9054004
    ],
    [
        60.1617669,
        24.9053575
    ],
    [
        60.1617602,
        24.9053147
    ],
    [
        60.1617535,
        24.9052719
    ],
    [
        60.1617467,
        24.905229
    ],
    [
        60.16174,
        24.9051863
    ],
    [
        60.1617333,
        24.9051434
    ],
    [
        60.1617265,
        24.9051005
    ],
    [
        60.1617219,
        24.9050711
    ],
    [
        60.1617128,
        24.9050134
    ],
    [
        60.1616528,
        24.9046316
    ],
    [
        60.1616443,
        24.9045771
    ],
    [
        60.1616214,
        24.9044312
    ],
    [
        60.1616169,
        24.904403
    ],
    [
        60.1616101,
        24.9043594
    ],
    [
        60.1616032,
        24.9043157
    ],
    [
        60.1615963,
        24.904272
    ],
    [
        60.1615895,
        24.9042283
    ],
    [
        60.1615826,
        24.9041847
    ],
    [
        60.1615757,
        24.904141
    ],
    [
        60.1615689,
        24.9040974
    ],
    [
        60.161562,
        24.9040536
    ],
    [
        60.1615552,
        24.90401
    ],
    [
        60.1615483,
        24.9039664
    ],
    [
        60.1615414,
        24.9039225
    ],
    [
        60.1615346,
        24.9038789
    ],
    [
        60.1615277,
        24.9038352
    ],
    [
        60.1615208,
        24.9037916
    ],
    [
        60.161514,
        24.9037478
    ],
    [
        60.1615071,
        24.9037042
    ],
    [
        60.1615037,
        24.9036824
    ],
    [
        60.1615003,
        24.9036605
    ],
    [
        60.1614934,
        24.9036169
    ],
    [
        60.1614865,
        24.9035733
    ],
    [
        60.1614797,
        24.9035296
    ],
    [
        60.1614728,
        24.9034859
    ],
    [
        60.1614659,
        24.9034422
    ],
    [
        60.1614591,
        24.9033986
    ],
    [
        60.1614522,
        24.9033549
    ],
    [
        60.1614453,
        24.9033111
    ],
    [
        60.1614385,
        24.9032674
    ],
    [
        60.1614316,
        24.9032238
    ],
    [
        60.1614248,
        24.9031802
    ],
    [
        60.1614179,
        24.9031365
    ],
    [
        60.1614122,
        24.9031004
    ],
    [
        60.1613973,
        24.9030054
    ],
    [
        60.1613937,
        24.9029823
    ],
    [
        60.1613836,
        24.9029183
    ],
    [
        60.1613814,
        24.9029044
    ]
];

	onMount(() => {
		map = L.map('map').setView([60.16207181470773, 24.904457261711535], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	});

	async function getBuildingFootprint() {
		// Fetch coordinates from the address
		const [latitude, longitude] = await getCoordsFromAddress(address);

		// Define a small bounding box around the coordinates
		const minLon = longitude - 1;
		const minLat = latitude - 1;
		const maxLon = longitude + 1;
		const maxLat = latitude + 1;

		// Ensure the bounding box is defined correctly
		if (minLon >= maxLon || minLat >= maxLat) {
			console.error('Invalid bounding box values:', { minLon, minLat, maxLon, maxLat });
			return; // Exit if the bounding box is invalid
		}

		const bbox = `${minLon},${minLat},${maxLon},${maxLat}`; // Correctly defined bbox

		// Construct the Overpass API URL with the bounding box
		const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["building"](around:20,${latitude},${longitude});way["building"](around:20,${latitude},${longitude});relation["building"](around:20,${latitude},${longitude}););out body;`;

		try {
			// Fetch building footprint data from Overpass API
			const response = await fetch(overpassUrl);
			const data = await response.json();
			console.log('Overpass API Response:', data); // Log the entire response

			// Fetch all Overpass API responses simultaneously
			// const fetchPromises = data.elements[0].nodes.map(async (node) => {
			// 	const overpassUrl1 = `https://overpass-api.de/api/interpreter?data=[out:json];(node(${node});way(${node});relation(${node}););out body;`;
			// 	const overpassResponse = await fetch(overpassUrl1);
			// 	return overpassResponse.json(); 
			// });

			// Wait for all promises to resolve
			//const overpassDataArray = await Promise.all(fetchPromises);
			const latlongs: L.LatLngExpression[] = mockOverlayCoordinates;
		
			// overpassDataArray.forEach(overpassData => {
			// 	latlongs.push([overpassData.elements[0].lat, overpassData.elements[0].lon] as L.LatLngTuple);
			// });
		
			
			var imageOverlay = L.imageOverlay('/src/screenshot_nobg.png', L.latLngBounds(latlongs)).addTo(map!);
	
			map!.setView([latitude, longitude], 30);
			//var polygon = L.polygon(latlongs, {color: 'red'}).addTo(map!);

		} catch (error) {
			console.error('Error fetching building footprint:', error);
		}
	}

	async function onSubmit(e: Event) {
		e.preventDefault();
		await getBuildingFootprint();
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
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1&polygon_svg=1`;

		let latitude = -1;
		let longitude = -1;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data && data.length > 0) {
				latitude = data[0].lat;
				longitude = data[0].lon;
				errorStr = '';

				// New: Get osm_id and place_id
				const osmId = data[0].osm_id;
				const placeId = data[0].place_id;
		

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
