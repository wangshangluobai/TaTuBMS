<template>
  <div>
    <div>
      <!-- 展示sku列表的结构 -->

      <el-table style="width: 100%; margin: 10px 0px" border :data="records" >
        <!--   style="margin-bottom:10px" -->
        <el-table-column type="index" label="序号" width="56" align="center">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="120">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="weight:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(kg)" width="100">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="100">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <!-- ,$index -->
          <template slot-scope="{row}">
            <!-- 按钮需要有悬浮提示信息 使用hintButton完成 -->
            <el-button
              type="info"
              icon="el-icon-top"
              size="mini"
              v-if="row.isSale==0"
              @click="onSale(row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-bottom"
              size="mini"
              v-else
              @click="cancel(row)"
            ></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table> 
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getSkuList"
        style="text-align:center"
        :current-page="page"
        :page-sizes="[3, 5, 7]"
        :page-size="limit"
        layout=" prev, pager, next, jumper, -> ,total, sizes "
        :total="total"
      >
      </el-pagination>
      <!-- 抽屉 -->
      <el-drawer 
        size=50%
        :show-close='false'
        :visible.sync="drawer">
        
        <!-- :direction="direction"
        :before-close="handleClose" -->
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{skuInfo.skuName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{skuInfo.price}}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <template >
              <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">{{attr.attrId}}-{{attr.valueId}}</el-tag>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel style="height:100%">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="height:100%;width:100%">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
        
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sku",
    data(){
    return {
      // 分页器 原始数据 
      page:1,
      limit:5,
      // 分页器 请求数据
      total:0,
      records:[],
      // skuInfo 列表
      skuInfo:{},
      // 抽屉开关
      drawer:false,
    }
  },
  methods:{
    async getSkuList(newPage=1){
      this.page = newPage
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuList(page,limit)
      if(result.code==200){ 
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    handleSizeChange(limit){
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async onSale(row){
      let result = await this.$API.sku.reqOnSale(row.id)
      if(result.code==200){
        row.isSale = 1
        this.$message({type:'success',message:'上架成功'})
      }
    },
    // 下架
    async cancel(row){
      let result = await this.$API.sku.reqCancelSale(row.id)
      if(result.code==200){
        row.isSale = 0
        this.$message({type:'success',message:'下架成功'})
      }
    },
    // 编辑
    edit(){
      this.$message('正在开发中')
    },
    // 详情   
    async getSkuInfo(row){
      // 打开抽屉
      this.drawer = true
      // 请求数据
      let result = await this.$API.sku.reqGetSku(row.id)
      if(result.code==200){
        console.log(result)
        this.skuInfo = result.data
      }
    },
  },
  mounted(){
    this.getSkuList()
  }
};
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
    width: 10px;
    height: 10px;
    background: tomato;
    border-radius: 50%;
  }
</style>
<style scoped>
.el-row .el-col-5{
  font-size: 18px;
  text-align: right;
}
.el-col{
  margin: 10px 10px;
}
</style> 