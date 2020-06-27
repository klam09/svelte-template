import { writable } from 'svelte/store';

export const checkoutList = writable([]);

export function addCheckoutListItem (newItem) {
    checkoutList.update(list => [newItem, ...list]);
}

export function removeCheckoutListItem (item) {
    const cloneList = checkoutList.slice(0)
    const targetIndex = checkoutList.find(listItem => listItem.id === item.id)
    cloneList.splice(targetIndex, 1);
    checkoutList.set(cloneList);
}
