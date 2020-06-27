<script>
    import { addCheckoutListItem } from '@stores';

    export let products = [];
</script>

<div class="product-list">
    {#each products as product}
        <div class="product">
            <div class="product-inner">
                <img src={product.image} alt={product.name} />
                <div class="category">{product.category}</div>
                <div class="name">{product.name}</div>
                <div class="price">{product.price}</div>
                <div class="product-more">
                <button on:click={() => addCheckoutListItem(product)}>Add To Cart</button>
                </div>
            </div>
        </div>
    {/each}
</div>

<style type="text/scss" lang="scss">
    @import '../styles/abstracts';

    .product-list {
        @include flex($flex-wrap: wrap);

        > .product {
            flex: 0 0 25%;
            cursor: pointer;
            overflow: hidden;

            &:hover {
                .product-inner > div.product-more {
                    bottom: 0;
                }
            }

            .product-inner {
                position: relative;
                padding: 5px 15px 40px;

                > img {
                    width: 100%;
                }

                > div {
                    &.category {
                        font-size: 12px;
                        margin-bottom: 4px;
                    }

                    &.name {
                        font-weight: bold;
                        font-size: 14px;
                        margin-bottom: 7px;
                    }

                    &.price {
                        font-size: 14px;
                        color: #2db1af
                    }

                    &.product-more {
                       @include absolute($left: 0, $right: 0, $bottom: -63px);
                       width: 100%;
                       left: 0;
                       right: 0;
                       padding: 11px 14px;
                       transition: bottom .7s ease;
                       background-color: #2db1af;

                       > button {
                           padding: 11px 5px;
                           background-color: white;
                           color: #2db1af;
                           border: 1px solid #2db1af;
                           border-radius: 4px;
                           min-width: 125px;
                           cursor: pointer;
                           font-size: 14px;
                       }
                    }
                }
            }
        }
    }
</style>
