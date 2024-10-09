<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { Control, Label } from 'formsnap';
	import { dateProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';

	import FormField from './FormField.svelte';

	export let form: SuperForm<T>;
	export let field: FormPathLeaves<T>;
	export let label: string;
	export let required: boolean = false;
	export let disabled: boolean = false;

	const proxyDate = dateProxy(form, field, { format: 'date' });
</script>

<FormField {form} name={field}>
	<Control let:attrs>
		<Label>{label}</Label>
		<input type="date" {required} {disabled} {...attrs} bind:value={$proxyDate} />
	</Control>
</FormField>

<style>
	/*::-webkit-calendar-picker-indicator {*/
	/*	filter: invert(1);*/
	/*}*/

	/*::-webkit-datetime-edit-day-field:focus,*/
	/*::-webkit-datetime-edit-month-field:focus,*/
	/*::-webkit-datetime-edit-year-field:focus {*/
	/*	background-color: transparent;*/
	/*	color: var(--primary-color-500);*/
	/*}*/
</style>
