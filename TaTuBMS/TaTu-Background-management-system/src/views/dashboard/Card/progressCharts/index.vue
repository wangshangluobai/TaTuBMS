<template>
  <!-- container -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
// import echarts from 'echarts'
export default {
  name:'progressCharts',
  mounted(){ 
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis:{
        // 隐藏
        show:false,
        min:0,
        max:100,
      },
      yAxis:{
        // 隐藏
        show:false,
        // 均分
        type:'category'
      },
      series:[
        {
          type:'bar',
          data:[78],
          barWidth:10,
          color:'yellowgreen',
          showBackground:'true',
          backgroundStyle:{
            color:'#eee'
          },
          label:{
            show:true,
            formatter:'|',
            position:'right',
          },
        }
      ],
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