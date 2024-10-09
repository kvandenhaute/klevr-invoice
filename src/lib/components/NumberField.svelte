<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { Control, Label } from 'formsnap';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';

	import FormField from './FormField.svelte';

	export let form: SuperForm<T>;
	export let field: FormPathLeaves<T>;
	export let label: string;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let min: number | null = null;
	export let max: number | null = null;

	const { value } = formFieldProxy(form, field);
</script>

<FormField {form} name={field}>
	<Control let:attrs>
		<Label>{label}</Label>
		<input type="number" {min} {max} {required} {disabled} {...attrs} bind:value={$value} />
	</Control>
</FormField>
