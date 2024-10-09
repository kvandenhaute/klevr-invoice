<script lang="ts">
	import type { PageData } from './$types';

	import { superForm } from 'sveltekit-superforms';

	import DateField from '$lib/components/DateField.svelte';
	import NumberField from '$lib/components/NumberField.svelte';

	export let data: PageData;

	const form = superForm(data.form);
</script>

<form method="POST">
	<DateField {form} field="invoiceDate" label="Invoice Date" />
	<NumberField {form} field="dailyRate" label="Daily Rate" />
	<NumberField {form} field="daysWorked" label="Days Worked" />
	<div class="form-actions">
		<button type="submit">Generate</button>
	</div>
</form>
