<template>
  <a :title="title" style="margin:0px 10px">
    <el-button v-on="$listeners" v-bind="$attrs"></el-button>
  </a>
</template>

<script>
export default {
  name:'HintButton',
  props:['title']
}
</script>

<style>

</style>