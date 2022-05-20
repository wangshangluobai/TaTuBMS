<template>
  <!-- container -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
// import echarts from 'echarts'
export default {
  name:'barChart',
  mounted(){ 
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis:{
        // 隐藏
        show:false,
        // 
        type:'category'
      },
      yAxis:{
        // 隐藏
        show:false
      },
      series:[
        {
          type:'bar',
          data:[15,68,45,29,81,56,78,6,91,38,49,67,49],
        }
      ],
      tooltip:{},
      grid:{
        top:0,
        left:0,
        right:0,
        bottom:0,
      }
    })
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>