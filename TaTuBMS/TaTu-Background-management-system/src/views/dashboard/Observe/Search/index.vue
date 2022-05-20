<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span> 
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class='el-icon-more'></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
      </el-row>
    </div>
    <div>
        <el-table
        border
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column
          type="index"
          label="排名" 
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="搜索关键字" 
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="用户数"
          sortable
          >
        </el-table-column>
        <!-- :formatter="formatter" -->
        <el-table-column
          prop="address"
          label="周涨幅"
          sortable
          >
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './lineCharts'
export default {
  name:'Search',
  data(){
    return {
      tableData:[{}]
    }
  },
  components:{LineCharts,}
}
</script>

<style scoped>
.search-header{
  display: flex;
  justify-content: space-between;
}
.header{
  padding-bottom:10px ;
  border-bottom:1px solid tomato;
}
.pagination{
  float: right;
}
</style>