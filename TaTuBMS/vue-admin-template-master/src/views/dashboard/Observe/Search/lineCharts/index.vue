<template>
  <div>
    <div class="header">
      <span class='titleHeader'>搜索用户数</span>
      <svg t="1651193584749" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1270" width="20" height="20"><path d="M512 179.2a332.8 332.8 0 1 1 0 665.6 332.8 332.8 0 0 1 0-665.6z m0 51.2a281.6 281.6 0 1 0 0 563.2 281.6 281.6 0 0 0 0-563.2z" p-id="1271"></path><path d="M512.768 339.968a38.7072 38.7072 0 1 1 0 77.3632 38.7072 38.7072 0 0 1 0-77.3632zM546.4576 678.6048h-27.2384c-14.2848 0-29.0304-12.3904-29.0304-23.7056V498.0224h-9.728a25.8048 25.8048 0 1 1 0-51.6096s31.488-0.1024 32.3072 0c13.1072 0.9728 22.5792 6.656 22.5792 17.3568v163.2768h11.1104a25.8048 25.8048 0 1 1 0 51.5584z" p-id="1272"></path></svg>
    </div>
    <div class="minPart">
      <span class="mineNum">12331</span>
      <span class="upOrDrop">17.1</span>
        <svg t="1651194635751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2062" width="16" height="16"><path d="M896 768l-80.896 0-131.072 0-155.648 0-159.744 0-141.312 0-100.352 0q-24.576 0-39.936-11.264t-20.992-28.672-0.512-38.4 22.528-41.472q37.888-40.96 79.872-86.016t86.016-91.136l86.016-92.16q44.032-46.08 83.968-89.088 18.432-19.456 44.032-28.672t52.736-8.704 53.248 11.776 45.568 31.744q70.656 73.728 147.456 159.744t160.768 184.32q19.456 23.552 26.624 46.592t2.56 40.96-20.48 29.184-40.448 11.264z" p-id="2063"></path></svg>
        <svg t="1651194793369" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3224" width="16" height="16"><path d="M878.592 250.88q29.696 0 48.128 11.264t24.576 29.696 0 41.472-26.624 45.568q-82.944 92.16-159.744 180.224t-148.48 164.864q-19.456 20.48-45.568 31.744t-53.76 11.776-53.248-8.704-43.008-28.672q-39.936-44.032-82.944-90.112l-88.064-92.16q-43.008-46.08-85.504-90.624t-79.36-86.528q-17.408-19.456-22.528-40.448t1.024-38.4 23.552-28.672 45.056-11.264q35.84 0 98.816-0.512t137.728-0.512l153.6 0 150.528 0 125.952 0 79.872 0z" p-id="3225"></path></svg>
    </div>
    <div class='footer'>
      <!-- canvas画布 -->
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'LineCharts',
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
          type:'line',
          data:[15,68,45,29,81,56,78,6,91,38,49,67,49],
          // 拐点样式
          itemStyle:{
            opacity:'0'
          },
          // 线条的样式
          lineStyle:{
            color:'purple'
          },
          areaStyle:{
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth:true,
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

<style scoped>
.header{
  display: flex;
  align-items: center;
}
.titleHeader{
  margin-right: 10px;
}
.minPart{
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.mineNum{
  margin-right: 20px;
}
.upOrDrop{
  margin-right: 10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>