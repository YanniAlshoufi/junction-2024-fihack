import type { GetMoneyRequest } from '$lib/models';

export const POST = async ({ request }: { request: Request }) => {
	const { bill, latitude, longitude, energyConsumption }: GetMoneyRequest = await request.json();

	console.log(bill, latitude, longitude, energyConsumption);

	return new Response(
		JSON.stringify({
			value: 436,
			effeciency: 0.67
		})
	);
};
