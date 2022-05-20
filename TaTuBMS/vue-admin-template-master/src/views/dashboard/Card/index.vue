<template>
  <div>
    <el-row :gutter="10">

      <el-col :span="6">
        <el-card>
          <Detail title='总销售额' count='￥ 126560'>
            <template slot='charts'>
              <span>
                周同比&nbsp;&nbsp;56.67%
                <svg t="1651194635751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2062" width="16" height="16"><path d="M896 768l-80.896 0-131.072 0-155.648 0-159.744 0-141.312 0-100.352 0q-24.576 0-39.936-11.264t-20.992-28.672-0.512-38.4 22.528-41.472q37.888-40.96 79.872-86.016t86.016-91.136l86.016-92.16q44.032-46.08 83.968-89.088 18.432-19.456 44.032-28.672t52.736-8.704 53.248 11.776 45.568 31.744q70.656 73.728 147.456 159.744t160.768 184.32q19.456 23.552 26.624 46.592t2.56 40.96-20.48 29.184-40.448 11.264z" p-id="2063"></path></svg>
              </span>  
              <span>
                日同比&nbsp;&nbsp;19.96%
                <svg t="1651194793369" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3224" width="16" height="16"><path d="M878.592 250.88q29.696 0 48.128 11.264t24.576 29.696 0 41.472-26.624 45.568q-82.944 92.16-159.744 180.224t-148.48 164.864q-19.456 20.48-45.568 31.744t-53.76 11.776-53.248-8.704-43.008-28.672q-39.936-44.032-82.944-90.112l-88.064-92.16q-43.008-46.08-85.504-90.624t-79.36-86.528q-17.408-19.456-22.528-40.448t1.024-38.4 23.552-28.672 45.056-11.264q35.84 0 98.816-0.512t137.728-0.512l153.6 0 150.528 0 125.952 0 79.872 0z" p-id="3225"></path></svg>
              </span>
            </template>  
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail> 
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail title='访问量' count='88460'>
            <template slot="charts">
              <lineChart></lineChart>
            </template>
            <template slot="footer">
              <span>日访问量 1123</span>
            </template>
          </Detail> 
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <Detail title='支付笔数' count='88460'>
            <template slot="charts">
              <barCarts></barCarts>
            </template>
            <template slot="footer">
              <span>转换率 63%</span>
            </template>  
          </Detail> 
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail title='运营活动效果' count='78%'>
            <template slot="charts">
              <progressCharts></progressCharts>
            </template>
            <template slot='footer'>
              <span>
                周同比&nbsp;&nbsp;16.47%
                <svg t="1651194635751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2062" width="16" height="16"><path d="M896 768l-80.896 0-131.072 0-155.648 0-159.744 0-141.312 0-100.352 0q-24.576 0-39.936-11.264t-20.992-28.672-0.512-38.4 22.528-41.472q37.888-40.96 79.872-86.016t86.016-91.136l86.016-92.16q44.032-46.08 83.968-89.088 18.432-19.456 44.032-28.672t52.736-8.704 53.248 11.776 45.568 31.744q70.656 73.728 147.456 159.744t160.768 184.32q19.456 23.552 26.624 46.592t2.56 40.96-20.48 29.184-40.448 11.264z" p-id="2063"></path></svg>
              </span>  
              <span>
                日同比&nbsp;&nbsp;14.26%
                <svg t="1651194793369" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3224" width="16" height="16"><path d="M878.592 250.88q29.696 0 48.128 11.264t24.576 29.696 0 41.472-26.624 45.568q-82.944 92.16-159.744 180.224t-148.48 164.864q-19.456 20.48-45.568 31.744t-53.76 11.776-53.248-8.704-43.008-28.672q-39.936-44.032-82.944-90.112l-88.064-92.16q-43.008-46.08-85.504-90.624t-79.36-86.528q-17.408-19.456-22.528-40.448t1.024-38.4 23.552-28.672 45.056-11.264q35.84 0 98.816-0.512t137.728-0.512l153.6 0 150.528 0 125.952 0 79.872 0z" p-id="3225"></path></svg>
              </span>
            </template>  
          </Detail> 
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from './lineChart'
import barCarts from './barCarts'
import progressCharts from './progressCharts'
export default {
  name: "Card",
  components: { Detail,lineChart,barCarts,progressCharts },
};
</script>

<style>
  *{
    font-size: 14px;
  }
</style>