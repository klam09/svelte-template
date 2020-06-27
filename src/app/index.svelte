<script>
    import Router from 'svelte-spa-router';
    import Home from '../pages/home';
    import Demo from '../pages/demo';

    const routes = {
        '/': Home,
        '/demo': Demo,
    };

    export let url = '';
</script>

<style>
    :global(html),
    :global(body) {
        height: 100%;
        margin: 0;
        width: 100%;
    }

    :global(body.no-outline *) {
        outline: none;
    }
</style>

<Router {routes}/>
