import '@webcomponents/webcomponentsjs';
import 'core-js';
import 'regenerator-runtime';
import App from './app/index.svelte';

const app = new App({
    target: document.body,
    props: {
        name: 'Svelte template',
    },
});

export default app;
