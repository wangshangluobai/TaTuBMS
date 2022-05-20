<template>
  <div>
    <el-card style="margin:20px 0px">
      <!-- 全局组件 自定义事件getCategoryId可以获取选中的ID  自定义属性show可以控制下拉框是否可行 -->
      <CategorySelect @getCategoryId='getCategoryId' :show='scene!=0' ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这部分可以切换三种不同的显示结构 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button type='primary' icon='el-icon-plus' :disabled="!category3id" @click="addSpu" >添加SPU</el-button>

        <el-table style="width: 100%;margin:10px 0px" border :data="spuList" >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- ,$index -->
            <template slot-scope="{row}" >
              <!-- 按钮需要有悬浮提示信息 使用hintButton完成 -->
              <hint-button type="success" icon='el-icon-plus' size='mini' title="添加Sku" @click="addSku(row)" ></hint-button>
              <el-button type="warning" icon='el-icon-edit' size='mini' title="修改Spu" @click="upDateSpu(row)" ></el-button>
              <el-button type="info" icon='el-icon-info' size='mini' title="查看当前Spu全部Sku列表" @click="showSku(row)" ></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)" >
                <el-button type="danger" icon='el-icon-delete' size='mini' title="删除Spu" slot="reference" ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align:center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, -> ,total, sizes "
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene='changeScene' ref="spu" ></SpuForm>  
      <SkuForm v-show="scene==2" @turnScene='turnScene' ref="sku"></SkuForm>  
    </el-card>
    <el-dialog :title="`${spu.spuName}的Sku列表`" :visible.sync="dialogTableVisible" :before-close="close" >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="默认照片" width="width">
          <template slot-scope='{row}'>
            <img :src="row.skuDefaultImg" style="weight:100px;height:100px;" >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name:'Spu',
  components:{
    SpuForm,SkuForm
  },
  data(){
    return {
      /* 存储从CategorySelect组件传来的id */
      category1id:'',
      category2id:'',
      category3id:'',
      // 分页器数据
      page:1,
      limit:3,
      total:0,
      spuList:[],
      // 切换组件的依据  0代表Spu列表数据  1代表添加修改Spu数据  2代表修改Sku数据
      scene:0,
      // 控制sku展示面板
      dialogTableVisible:false,
      // 某个spu
      spu:{},
      // 请求sku列表的数据
      skuList:[],
      // 加载效果控件
      loading:true,
    }
  },
  methods:{
    getCategoryId({id,level}){
      // 根据level的值判断id所属层级
      if(level==1){
        this.category1id = id
        this.category2id = ''
        this.category3id = ''
      }else if(level==2){
        this.category2id = id
        this.category3id = ''
      }else{
        this.category3id = id
        this.getSpuList()
      }
    },
    async getSpuList(newPage = 1){
      this.page = newPage
      const {page, limit, category3id} = this
      // newPage !== undefined?page=newPage:''  瞎了眼了你
      let result = await this.$API.spu.reqSpuList(page,limit,category3id)
      if(result.code==200){
        const {total,records} = result.data
        this.total = total
        this.spuList = records
      }
    },
    handleSizeChange(newLimit){
      // 更新每页展示数目
      this.limit = newLimit
      // 当前页数默认为1
      this.getSpuList()
    },
    // 添加Spu属性 切换展示结构
    addSpu(){
      // 改变组件展示
      this.scene = 1
      // 点击添加按钮 触发子组件发请求
      this.$refs.spu.addSpuData(this.category3id)
    },
    // 修改Spu属性 切换展示结构
    upDateSpu(row){
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    // 接受子组件更改组件结构信息
    changeScene({scene,flag}){
      this.scene = scene
      if(flag=='修改'){
        this.getSpuList(this.page)
      }else{
        this.getSpuList()
      }
    },
    // 删除Spu信息
    async deleteSpu(row){ 
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message({type:'success',message:'删除成功'})
        // 当当前页长度为1？  当列表总页数长度为1  分页器应该有设定 长度不能为小于1
        this.getSpuList(this.spuList.length>1?this.page:this.page-1)
      }
    },
    addSku(row){
      // 切换组件
      this.scene = 2
      // 触发sku内 请求数据函数
      this.$refs.sku.getData(this.category1id,this.category2id,row);
    },
    // sku取消回调
    turnScene(){
      this.scene = 0
    },
    // 展示Sku
    async showSku(row){
      // 切换展示Sku信息页面
      this.dialogTableVisible = true
      // 收集row
      this.spu = row
      // 请求sku列表
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code==200){
        this.skuList = result.data
        //loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框回调
    close(done){
      // loading状态初始化
      this.loading = true
      // 清除残留数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style>

</style>