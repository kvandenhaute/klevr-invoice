<script lang="ts">

	function onSubmit() {
		fetch('./pdf.json', {
			method: 'POST'
		})
		.catch(console.error);
	}
</script>

<main>
	<button on:click={onSubmit}>Click</button>
</main>
