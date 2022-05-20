<template>
  <div>
    <!-- inline 代表的是行内表单 一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model='cForm.categoryone' @change="handlerOne" :disabled="$attrs.show" >
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in listone" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model='cForm.categorytwo' @change="handlerTwo" :disabled="$attrs.show" >
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in listtwo" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model='cForm.categorythree' @change="handlerThree" :disabled="$attrs.show" >
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in listthree" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'CategorySelect',
  data(){
    return {
      // 存储来自服务器的一级分类列表数据
      listone:[],
      listtwo:[],
      listthree:[],
      // 收集表单value 供下级分类请求
      cForm:{
        categoryone:'',
        categorytwo:'',
        categorythree:'',
      },
    }
  },
  props:['getCategoryId'],
  methods:{
    // 组件挂载获取一级分类数据
    async getCategoryOne(){
      let result = await this.$API.attr.reqFirstListData();
      // console.log(result)
      if(result.code==200){
        this.listone = result.data
        return '一级分类数据获取成功'
      }else{
        return '一级分类数据获取失败'
      }
    },
    // 根据已选择一级分类的ID请求二级分类数据
    async handlerOne(){
      this.listtwo = [],
      this.listthree = [],
      this.cForm.categorytwo = '',
      this.cForm.categorythree = ''
      let result = await this.$API.attr.reqSecondLevelData(this.cForm.categoryone)
      // console.log(result)
      if(result.code==200){
        this.listtwo = result.data
        this.$emit('getCategoryId',{id:this.cForm.categoryone,level:1})
        return '获取二级分类数据成功'
      }else{
        return '获取二级分类数据失败'
      }
    },
    // 根据已选择二级分类的ID请求三级分类数据
    async handlerTwo(){
      this.listthree = []
      this.cForm.categorythree = ''
      let result = await this.$API.attr.reqThreeLevelData(this.cForm.categorytwo)
      if(result.code==200){
        this.listthree = result.data
        this.$emit('getCategoryId',{id:this.cForm.categorytwo,level:2})
        return '获取三级分类数据成功'
      }else{
        return '获取三级分类数据失败'
      }
    },
    // 
    handlerThree(){
      this.$emit('getCategoryId',{id:this.cForm.categorythree,level:3})
    },
  },
  mounted(){
    this.getCategoryOne()
  }
}
</script>

<style>

</style>