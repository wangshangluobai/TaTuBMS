<template>
  <el-card class="saleCard">
    <div slot="header" class="category-header">
      <span>销售类别占比</span> 
      <el-radio-group v-model="radioValue">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button> 
      </el-radio-group> 
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'Category',
  data(){
    return {
      radioValue:'全部渠道',
    }
  },
  mounted(){
    let myechart = echarts.init(this.$refs.charts)
    myechart.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: 'item'
      }, 
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            // position: 'outsize'
          }, 
          labelLine: {
            show: true, 
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
   });
  //  绑定事件
  myechart.on('mouseover',(params)=>{
    // 获取鼠标移上去的那条数据
    const {name,value} = params.data;
    // 重新设置标题
    myechart.setOption({
      title:{
        text:name,
        subtext:'value'
      }
    })
  })
  }
}
</script>

<style scoped>
.saleCard{
  padding: 10px;
}
.category-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid tomato;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>