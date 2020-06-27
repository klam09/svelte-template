<script>
    import Logo from '@images/shit.jpg';
    import CheckoutCart from './checkoutCart';
</script>

<style>
    .header {
        background-color: black;
        padding: 10px 30px;
        display: flex;
        justify-content:space-between;
        align-items: flex-end;
    }

    .logo {
        width: 150px;
    }
</style>

<div class="header">
    <img class="logo" src={Logo} alt="" />
    <CheckoutCart />
</div>
