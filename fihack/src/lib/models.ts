export const CURRENCIES = [
	'EUR', // Euro
	'USD', // US Dollar
	'GBP', // British Pound
	'JPY', // Japanese Yen
	'CNY', // Chinese Yuan
	'CHF', // Swiss Franc
	'CAD', // Canadian Dollar
	'AUD', // Australian Dollar
	'NZD', // New Zealand Dollar
	'INR', // Indian Rupee
	'BRL', // Brazilian Real
	'RUB', // Russian Ruble
	'KRW', // South Korean Won
	'SGD', // Singapore Dollar
	'HKD', // Hong Kong Dollar
] as const;

export type Currency = (typeof CURRENCIES)[number];

export type GetMoneyRequest = {
	time: number;
	bill: number;
	currencyOfBill: Currency;
	latitude: number;
	longitude: number;
	rating: string;
};

export type GetMoneyResponse = {
	currency: Currency;
	value: number;
	effeciency: number;
};
