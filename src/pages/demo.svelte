<script>
    import { onMount } from 'svelte';

    import Page from '@components/page';
    import Banner from '@components/banner';
    import ProductList from '@components/productList';

    import ProductImg from '@images/shit.jpg';

    let productList = [];

    onMount(async () => {
        const product = {
            image: ProductImg,
            category: 'Product',
            name: 'Product 1',
            price: 'HK$ 5,080',
        };

        productList = await Promise.resolve(Array(10).fill(product));
    });
</script>

<style type="text/scss" lang="scss">
    @import '../styles/abstracts';
    .total {
        padding: 10px 0;
    }
</style>

<Page>
    <Banner title="Products" />
    <div class="total">Total Product: {productList.length}</div>
    <ProductList products={productList} />
</Page>
