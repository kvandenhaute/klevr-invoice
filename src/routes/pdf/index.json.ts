import Template from 'nunjucks';
import PDF from 'wkhtmltopdf';

export async function post() {
	const invoiceNumber = 2024100901;
	const intl = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' });
	const units = 20;
	const unitPrice = 570;
	const price = units * unitPrice;

	const html = Template.render('src/routes/pdf/_base.njk', {
		invoiceNumber,
		invoiceDate: '9 oktober 2024',
		dueDate: '23 oktober 2024',
		monthPerformed: 'September',
		yearPerformed: 2024,
		units,
		unitPrice: intl.format(unitPrice),
		price: intl.format(price),
		vat: intl.format(price * 0.21),
		totalGross: intl.format(price),
		totalVAT: intl.format(price * 0.21),
		totalNetto: intl.format(price * 1.21),
		paymentReference: getPaymentReference(invoiceNumber)
	});

	const pdfOptions = {
		pageSize: 'A4',
		orientation: 'portrait',
		dpi: 300,
		encoding: 'UTF-8',
		marginTop: 0,
		marginRight: 0,
		marginBottom: 0,
		marginLeft: 0,
		noOutline: true,
		output: `./kevin_van_den_haute_bv_${invoiceNumber}.pdf`
	};

	return new Promise((resolve, reject) => {
		PDF(html, pdfOptions, (err, res) => {
			if (err) {
				console.log(err);

				return reject(err);
			}

			return resolve(res);
		});
	})
		.then(() => {
			return {
				status: 200,
				headers: {
					'Content-disposition': `attachment; filename=kevin_van_den_haute_bv_${invoiceNumber}.pdf`,
					'Content-type': 'application/pdf'
				},
			}
		})
		.catch((e) => ({ status: 500, body: e.message }));
}

function getPaymentReference(reference: number) {
	const modulus: number = reference % 97;
	let modulusAsString: string;

	if (modulus === 0) {
		modulusAsString = '97';
	} else if (modulus < 10) {
		modulusAsString = `0${modulus}`;
	} else {
		modulusAsString = modulus.toString();
	}

	const referenceAsString: string = reference.toString() + modulusAsString;

	return `+++${referenceAsString.substr(0, 3)}/${referenceAsString.substr(3, 4)}/${referenceAsString.substr(7, 5)}+++`;
}
