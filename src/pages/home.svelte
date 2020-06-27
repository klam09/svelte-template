<script>
    import { link } from 'svelte-spa-router';
</script>

<style type="text/scss" lang="scss">
    h1 {
        color: purple;
    }
</style>

<h1>Svelte Demo Home</h1>
<a href='/demo' use:link>Go to demo page</a>
