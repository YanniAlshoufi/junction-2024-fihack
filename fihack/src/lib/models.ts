export type GetMoneyRequest = {
	bill: number;
	latitude: number;
	longitude: number;
	energyConsumption: number;
};

export type GetMoneyResponse = {
	value: number;
	effeciency: number;
};
