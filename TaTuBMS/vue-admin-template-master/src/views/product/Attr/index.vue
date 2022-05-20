<template>
  <dir>
    <el-card style="margin:20px 0px">
      <!-- 全局组件 自定义事件getCategoryId可以获取选中的ID  自定义属性show可以控制下拉框是否可行 -->
      <CategorySelect @getCategoryId='getCategoryId' :show='!isShowTable' ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon='el-icon-plus' :disabled="!category3Id" @click="addAttr" >添加属性</el-button>
        <!-- 表格 展示平台属性 -->
        <el-table :data="categoryList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center" ></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- ,$index -->
            <template slot-scope='{row}'>
              <!-- (attrValue,index) -->
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin:0px 10px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <!-- ,$index -->
            <template slot-scope="{row}">
              <el-button type="warning" icon='el-icon-edit' size='mini' @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon='el-icon-delete' size='mini' @click="isShowTable=false"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <!-- :model="form"  -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
          <el-button type="primary" icon='el-icon-plus' @click="addAttrValue" :disabled="!attrInfo.attrName" >添加属性值</el-button>
          <el-button @click="isShowTable=true" >取消</el-button>
          <el-table style="width:100%;margin:20px 0px" border :data="attrInfo.attrValueList" >
            <el-table-column align="center" type="index" label="序号" width='80' >
            </el-table-column>
            <el-table-column prop='prop' label="属性值名称" width='width' >
              <!--  -->
              <template slot-scope="{row,$index}">
                <el-input :ref='$index' v-model="row.valueName" placeholder='请输入属性值名称' v-if="row.flag" 
                @blur='changeTagLook(row)' @keyup.native.enter="changeTagLook(row)" ></el-input>
                <span v-else @click="changeTagEdit(row,$index)" style="dispaly:block" >{{row.valueName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='prop' label="操作" width='width' > 
              <template slot-scope="{row,$index}">
                <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm='deleteAttrValue($index)'>
                  <el-button slot="reference" type="danger" icon='el-icon-delete' size='mini'></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="addOrUpdate" :disabled="attrInfo.attrValueList.length<1" >保存</el-button>
          <el-button @click="isShowTable=true" >取消</el-button>
      </div>
    </el-card>
  </dir>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name:'Attr',
  data(){
    return {
      // 子组件通过回调函数传来的ID
      category1Id:'',
      category2Id:'',
      category3Id:'',
      // 从服务器请求的三级分类下的数据
      categoryList:[],
      // 切换table的展示状态
      isShowTable:true,
      // 收集添加|更新 的数据
      attrInfo:{
        attrName: "", // 属性名
        attrValueList: [ // 属性值  属性值可以有多个 使用数组 每一个属性值都是一个对象 需要有id及属性值
        ],
        categoryId: 0, // 三级分类的Id
        categoryLevel: 3, // 服务器需要区分几级ID
      },
      // flag:true,
    }
  },
  methods:{
    getCategoryId(data){
      if(data.level==1){
        this.category1Id = data.id
        this.category2Id = ''
        this.category3Id = ''
      }else if(data.level==2){
        this.category2Id = data.id
        this.category3Id = ''
      }else{
        this.category3Id = data.id
        this.getCategoryList()
      }
    },
    async getCategoryList(){
      const { category1Id,category2Id,category3Id } = this
      let result = await this.$API.attr.reqAttrInfoList(category1Id,category2Id,category3Id) 
      if(result.code == 200){
        this.categoryList = result.data
      }
    },
    // 新增Attr数据
    addAttrValue(){ 
      this.attrInfo.attrValueList.push({
        // 修改某一属性时 可在已有的属性值之上新增属性值 新增属性值时 需要把已有的属性值的id带上
        attrId:this.attrInfo.id,
        valueName:'',
        flag:true,
      }) 
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 添加Attr信息 
    addAttr(){
      this.isShowTable=false
      this.attrInfo = {
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3,
      }
    },
    // 更新Attr信息
    updateAttr(row){
      this.isShowTable=false
      // 深浅拷贝很重要
      this.attrInfo = cloneDeep(row)
      // 更改信息需要切换状态为input  但是从服务器传来的数据中没有flag
      // 需要为其添加属性 但是在Vue实例生成之前的数据  Vue会自动的为每个可迭代的
      // 数据添加一个getter和setter属性 但是后添加的却不会有
      // 可以通过$set 方法添加  这样被添加的属性也会拥有set和get方法
      this.attrInfo.attrValueList.forEach(e => {
        // 参数 第一个 被添加属性的对象 第二个 添加新的响应式属性  第三个 新属性的属性值 
        this.$set(e,'flag',false);
      });
    },
    // 切换input|span标签
    changeTagLook(row){
      // 属性值不能为空 
      if(row.valueName.trim()===''){
        this.$message('该值不合法')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item)=>{
        // 注意 在判断的时候 将row从数组中去除 否则每次都是true
        // row是最新新增的属性值 数组的最后一项元素
        if(row !== item){
          return row.valueName == item.valueName
        } 
      })
      // if(isRepat) return
      if(isRepat){
        this.$message('该值已存在')
        row.valueName = ''
        return
      }
      row.flag=false
    },
    // 更改span元素为input框 
    changeTagEdit(row,index){
      row.flag=true
      // 获取input节点 实现自动聚焦
      // 在点击切换时 页面会重新渲染 重绘 重排 这些操作需要时间  
      // 但点击回调事件却是立即执行的  所以会产生获取不到DOM节点的问题
      // 使用$nextTick 当节点重新渲染完毕 会自动调用回调
      this.$nextTick(()=>{
        // $refs是动态的 不可以使用   .属性  
        this.$refs[index].focus();
      })
    },
    // 删除Attr某一属性
    // 注意elementUI的版本不同 其功能也有变动
    deleteAttrValue(index){
      // 当前删除操作不需要发请求
      this.attrInfo.attrValueList.splice(index,1)
    },
    async addOrUpdate(){
      // 整理参数 去除后台不需要的flag属性 以及空信息
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{ 
        if(item.valueName!=''){ 
          delete item.flag
          return true
        }
      })
      try { 
        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo)
        
        // 返回信息展示页面    reqAddOrUpdateAttrInfo
        this.isShowTable = true
        // 成功信息
        this.$message({type:'success',message:'保存成功'})
        // 重新获取数据
        this.getCategoryList()
      } catch (error) {
        this.$message('保存00失败')
      }
      /* let result = await reqAddOrUpdateAttrInfo(this.attrInfo)
      console.log(result)
      if(result.code == 200){
        return '保存成功'
      }else{
        return '保存失败'
      } */
    }
  },
}
</script>

<style>

</style>