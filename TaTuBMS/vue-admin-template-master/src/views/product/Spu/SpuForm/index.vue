<template>
  <div>
    <!-- :model="form"  -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in teademarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows='4' placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- action 图片上传地址  list-type 文件列表的类型  on-preview 图片预览  on-remove 删除图片 -->
        <!-- file-list 照片墙需要展示的数据##数组 数组里面的元素务必有name url属性 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list='spuImageList'
          :on-preview="handlePictureCardPreview"
          :on-success='addSuccess'
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性"> 
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="unAttrIdAndName">
          <el-option v-for="un in unSelectSaleAttr" :label="un.name" :value="`${un.id}:${un.name}`" :key="un.id" ></el-option>
        </el-select>
        <el-button type="primary" icon='el-icon-plus' style="margin:5px 5px" :disabled="!unAttrIdAndName" @click="addAttrValue" >添加销售属性</el-button>
        <!-- :data="data" -->
        <el-table style="width: 100%;margin:5px 0px" border :data="spu.spuSaleAttrList" >
          <el-table-column type="index" label="序号" width="80px" align='center'>
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="90">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- ,$index -->
            <template slot-scope="{row}">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 相当与之前写的span和input之间的切换   @keyup.enter.native="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small" 
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)" >+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="80">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon='el-icon-delete' size='mini' @click="spu.spuSaleAttrList.splice($index,1)" ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'SpuForm',
  data(){
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储Spu信息
      spu:{
        // 三级分类Id
        category3Id: 0,
        // 描述
        description: "",
        // Spu名称
        spuName: "",
        // 品牌的Id
        tmId: null,
        // 收集Spu图片信息
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0
          }
        ],
        // 平台属性与属性值
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0
              }
            ]
          } */
        ],
      },
      // 品牌信息
      teademarkList:[],
      // Spu图片信息
      spuImageList:[],
      // 销售属性
      baseSaleAttrList:[],
      // 收集未选择的销售属性
      unAttrIdAndName:'',
    }
  },
  computed:{
    // 计算出baseSaleAttrList 和 spu.spuSaleAttrList.saleAttrName 的差值
    unSelectSaleAttr(){
      return this.baseSaleAttrList.filter((i)=>{
        return this.spu.spuSaleAttrList.every((j)=>{
          return i.name != j.saleAttrName
        })
      })
    }
  },
  methods:{
    // 照片墙的图片被删除
    handleRemove(file, fileList) {
      // file 代表的是删除的那个图片数据
      // fileList 代表的是删除之后 剩余图片
      // 这个数组中每一个对象中都包含name url属性 这是在请求数据后自己添加的  为了照片墙显示
      // 然 服务器不需要  提交时需记得整理
      this.spuImageList = fileList
    },
    // 收集新增的销售属性
    addAttrValue(){
      // 将数据收集在spu下spuSaleAttrList 组件渲染的数据来源于此 更新数据会引起页面重新渲染
      const [baseSaleAttrId,saleAttrName] = this.unAttrIdAndName.split(':')
      let newAttrValue = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newAttrValue)
      // 清空残留数据
      this.unAttrIdAndName = ''
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片
    addSuccess(response, file, fileList){
      // response 代表成功的信息
      // file 代表上传成功的图片
      // fileList 代表上传之后图片的列表
      this.spuImageList = fileList
    },
    // 添加销售属性值
    addSaleAttrValue(row){
      // 点击销售属性值当中添加按钮时 需要由button变为input  通过当前销售属性的inputVisible控制
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue','')
    },
    // input失去焦点 收集数据
    handleInputConfirm(row){
      // 结构出销售属性数据
      const {baseSaleAttrId,inputValue} = row
      // 新增的销售属性值的名称不能为空
      if(inputValue.trim()==''){
        this.$message('属性值不能为空');
        return
      }
      // 属性值不能重复  some   every
      let result = row.spuSaleAttrValueList.every(i=>i.saleAttrValueName!=inputValue);
      if(!result) return
      // 新增的销售属性值
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible为false 切换为button
      row.inputVisible = false
    },
    // 初始化SpuForm组件信息
    async initSpuData(spu){
      // 请求Spu信息数据
      let spuResult = await this.$API.spu.reqSpuById(spu.id)
      if(spuResult.code==200){
        // console.log(spuResult)
        this.spu = spuResult.data
      }else{
        return $message('获取Spu信息失败')
      }
      // 获取品牌信息
      let teademarkResult = await this.$API.spu.reqTrademarkList()
      if(teademarkResult.code==200){
        // console.log(teademarkResult)
        this.teademarkList = teademarkResult.data
      }else{
        return $message('获取品牌信息失败')
      }
      // 获取Spu图标请求
      let spuImageListResult = await this.$API.spu.reqSpuImageList(spu.id)
      if(spuImageListResult.code==200){
        let listArr = spuImageListResult.data
        // 由于elementUI所需的属性名与服务器返回的属性名不同  需要在spuImageList中
        // 添加elementUI所需要的属性名及相应的属性值
        listArr.forEach((i)=>{
          i.name = i.imgName
          i.url = i.imgUrl
        })
        this.spuImageList = listArr
      }else{
        return $message('获取Spu图标失败')
      }
      // 请求平台全部销售属性
      let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
      if(baseSaleAttrListResult.code==200){
        this.baseSaleAttrList = baseSaleAttrListResult.data
      }else{
        return $message('获取平台全部销售属性失败')
      }
    },
    // 保存按钮回调
    async addOrUpdateSpu(){
      // 整理参数  照片墙调整
      // 携带字段 图片需要携带imageName 和 imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(i=>{
        return {
          imgName:i.name,
          imgUrl:(i.response&&i.response.data)||i.url
        }
      })
      // 发送请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code==200){
        this.$message({type:'success',message:'保存成功'})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
      // 清除数据残留
      Object.assign(this._data,this.$options.data())
    },
    // 取消按钮
    cancel(){
      // 触发回调  切换组件
      this.$emit('changeScene',{scene:0,flag:''})
      // 清除数据残留
      // Object.assign ES6 语法 合并对象
      // this.$options可以获取配置对象  配置对象的data函数执行 返回响应式数据为空
      Object.assign(this._data,this.$options.data())
    },
    // 添加Spu信息 请求数据
    async addSpuData(id){
      // 收集三级Id
      this.spu.category3Id = id
      // 获取品牌信息
      let teademarkResult = await this.$API.spu.reqTrademarkList()
      if(teademarkResult.code==200){
        // console.log(teademarkResult)
        this.teademarkList = teademarkResult.data
      }else{
        return $message('获取品牌信息失败')
      }
      // 请求平台全部销售属性
      let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
      if(baseSaleAttrListResult.code==200){
        this.baseSaleAttrList = baseSaleAttrListResult.data
      }else{
        return $message('获取平台全部销售属性失败')
      }
    },
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>