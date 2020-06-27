import { writable } from 'svelte/store';

export const isLoggedIn = writable(false);

export function setLoginState(state) {
    isLoggedIn.set(state)
}
