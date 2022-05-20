<template>
  <div>
    <div class="cart-header">
      <span>{{title}}</span>
      <svg t="1651193584749" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1270" width="20" height="20"><path d="M512 179.2a332.8 332.8 0 1 1 0 665.6 332.8 332.8 0 0 1 0-665.6z m0 51.2a281.6 281.6 0 1 0 0 563.2 281.6 281.6 0 0 0 0-563.2z" p-id="1271"></path><path d="M512.768 339.968a38.7072 38.7072 0 1 1 0 77.3632 38.7072 38.7072 0 0 1 0-77.3632zM546.4576 678.6048h-27.2384c-14.2848 0-29.0304-12.3904-29.0304-23.7056V498.0224h-9.728a25.8048 25.8048 0 1 1 0-51.6096s31.488-0.1024 32.3072 0c13.1072 0.9728 22.5792 6.656 22.5792 17.3568v163.2768h11.1104a25.8048 25.8048 0 1 1 0 51.5584z" p-id="1272"></path></svg>
    </div>
    <div class="cart-num">{{count}}</div>
    <div class="cart-echart">
      <slot name="charts"></slot>
    </div>
    <div class="cart-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'Detail',
  props:['title','count',]
}
</script>

<style>
  .cart-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
  }
  .cart-num{
    font-size: 30px;
    padding:10px 0px;
  }
  .cart-echart{
    height:50px;
  }
  .cart-footer{
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
</style>