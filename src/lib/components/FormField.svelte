<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath } from 'sveltekit-superforms';

	// the form object
	type T = Record<string, unknown>;
	// the path/name of the field in the form object
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { SuperForm } from 'sveltekit-superforms';

	import { Field, FieldErrors, type FieldProps } from 'formsnap';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = FieldProps<T, U>;

	export let form: SuperForm<T>;
	export let name: U;
</script>

<div class="form-field">
	<!-- passing the slot props down are optional -->
	<Field {form} {name} let:value let:errors let:tainted let:constraints>
		<slot {value} {errors} {tainted} {constraints} />
		<FieldErrors />
	</Field>
</div>

<style lang="scss">
	div :global([data-fs-field-errors]) {
		margin-top: calc(var(--base-spacing--sm) - 0.25em);
		color: var(--primary-color-500);
		font-size: 0.875em;

		&:empty {
			display: contents;
		}
	}
</style>
