import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';
import Template from 'nunjucks';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import wkhtmltopdf from 'wkhtmltopdf';
import z from 'zod';

const intl = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' });
const formSchema = z.object({
	invoiceDate: z.date().default(new Date()),
	dailyRate: z.number().default(570),
	daysWorked: z.number(),
});

export const load: PageServerLoad = async () => {
	const previousMonth = getPreviousMonth();
	const month = previousMonth.getMonth();
	const year = previousMonth.getFullYear();

	const form = await superValidate({ daysWorked: getTotalWeekDaysInMonth(year, month) }, zod(formSchema));

	return { form };
};

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event.request, zod(formSchema.readonly()));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { invoiceDate, daysWorked, dailyRate } = form.data;
		const invoiceNumber = `${invoiceDate.getFullYear()}${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}${invoiceDate.getDate().toString().padStart(2, '0')}01`;

		const html = renderToHtml(invoiceDate, invoiceNumber, daysWorked, dailyRate);

		// @ts-expect-error TS2769: No overload matches this call.
		wkhtmltopdf(html, {
			pageSize: 'A4',
			orientation: 'portrait',
			dpi: 300,
			encoding: 'UTF-8',
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			noOutline: true,
			output: `./invoices/kevin_van_den_haute_bv_${invoiceNumber}.pdf`,
		});

		redirect(303, '/');
	},
};

function renderToHtml(invoiceDate: Date, invoiceNumber: string, daysWorked: number, dailyRate: number) {
	const gross = dailyRate * daysWorked;

	const dueDate = new Date(invoiceDate);
	dueDate.setDate(invoiceDate.getDate() + 14);

	const monthPerformed = getPreviousMonth(invoiceDate);

	return Template.render(`${import.meta.dirname}/pdf.njk`, {
		invoiceNumber,
		invoiceDate: `${invoiceDate.getDate()} ${getMonthAsText(invoiceDate)} ${invoiceDate.getFullYear()}`,
		dueDate: `${dueDate.getDate()} ${getMonthAsText(dueDate)} ${dueDate.getFullYear()}`,
		monthPerformed: ucfirst(getMonthAsText(monthPerformed)),
		yearPerformed: monthPerformed.getFullYear(),
		units: daysWorked,
		unitPrice: intl.format(dailyRate),
		price: intl.format(gross),
		vat: intl.format(gross * 0.21),
		totalGross: intl.format(gross),
		totalVAT: intl.format(gross * 0.21),
		totalNet: intl.format(gross * 1.21),
		paymentReference: getPaymentReference(invoiceNumber),
	});
}

function getMonthAsText(date: Date) {
	return date.toLocaleString('nl-BE', { month: 'long' });
}

function getPaymentReference(invoiceNumber: string) {
	const modulus: number = parseInt(invoiceNumber, 10) % 97;
	let modulusAsString: string;

	if (modulus === 0) {
		modulusAsString = '97';
	} else {
		modulusAsString = modulus.toString().padStart(2, '0');
	}

	const reference: string = invoiceNumber + modulusAsString;

	return `+++${reference.substring(0, 3)}/${reference.substring(3, 7)}/${reference.substring(7, 12)}+++`;
}

function getPreviousMonth(date: Date = new Date()) {
	const month = date.getMonth();
	const year = date.getFullYear();

	if (month === 0) {
		return new Date(year - 1, 11);
	}

	return new Date(year, month - 1);
}

function getTotalWeekDaysInMonth(year: number, month: number) {
	const totalDays = 32 - new Date(year, month, 32).getDate();
	let totalWeekDays: number = 0;

	for (let i = 1; i <= totalDays; i++) {
		const day = new Date(year, month, i).getDay();

		if (day > 0 && day < 6) {
			totalWeekDays++;
		}
	}

	return totalWeekDays;
}

function ucfirst(str: string) {
	return `${str[0].toUpperCase()}${str.substring(1)}`;
}
