<script>
    import { onDestroy } from 'svelte';
    import Icon from '@images/shopcart.png';
    import { checkoutList } from '@stores';

    let isActive = false;
    let checkoutItems = [];

    const unsubscribe = checkoutList.subscribe((value) => { checkoutItems = value; });
    onDestroy(unsubscribe);

    function toggleDropdown() {
        isActive = !isActive;
    }
</script>

<div class="shopping-cart-wrapper">
    <button class="shopping-cart" on:click={toggleDropdown}>
        <img class="icon" src={Icon} alt="" />
        Shopping Cart
        {#if checkoutItems.length > 0}
        ({checkoutItems.length})
        {/if}
        <span>
    </button>
    <div class={`dropdown ${isActive ? 'active' : 'inactive'}`}>
        {#if checkoutItems.length > 0}
            {#each checkoutItems as checkoutItem}
                <div class="checkout-item">
                    <div>{checkoutItem.name}</div>
                    <div>{checkoutItem.price}</div>
                </div>
            {/each}
        {:else}
            <div class="empty">
                Empty Checkout Cart
            </div>
        {/if}
    </div>
</div>

<style type="text/scss" lang="scss">
    @import '../styles/abstracts';

    .shopping-cart-wrapper {
        position: relative;

        .shopping-cart {
            display: flex;
            align-items: center;
            color: white;
            cursor: pointer;
            border: none;
            background: transparent;
            padding: 0;
            font-size: 14px;

            .icon {
                width: 20px;
                height: 20px;
            }
        }

        .dropdown {
            @include absolute($right: 0);
            width: 300px;
            padding: 20px;
            z-index: 10;
            box-shadow: 0px 6px 6px 0px rgba(13,4,9,0.13);
            background-color: white;
            margin-top: 5px;
            display: none;

            &.active {
                display: block;
            }

            .checkout-item {
                &:not(:first-child) {
                    margin-top: 8px;
                }
            }

            .empty {
                text-align: center;
                padding: 11px 0 30px;
            }
        }
    }
</style>
