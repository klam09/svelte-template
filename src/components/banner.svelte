<script>
    import defaultBanner from '@images/shit.jpg';

    export let banner = defaultBanner;
    export let title = '';
</script>

<style>
    .banner-container {
        position: relative;
    }

    img {
        width: 100%;
    }

    .title {
        position: absolute;
        padding: 20px 100px;
        background-color: white;
        opacity: 0.7;
        color: black;
        top: 50%;
        left: 50px;
        transform: translateY(-50%);
    }
</style>

<div class='banner-container'>
    <img src={banner} alt='' />
    {#if title}
        <div class="title">{title}</div>
    {/if}
</div>
