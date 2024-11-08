import type { GetMoneyRequest } from '$lib/models';

export const POST = async ({ request }: { request: Request }) => {
	const { time, bill, currencyOfBill, latitude, longitude, rating }: GetMoneyRequest =
		await request.json();

	console.log(rating);

	const value = +time * +bill + latitude * longitude;

	return new Response(
		JSON.stringify({
			currency: currencyOfBill,
			value,
			effeciency: 100000 / value,
		}),
	);
};
