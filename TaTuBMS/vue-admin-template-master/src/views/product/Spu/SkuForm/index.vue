<template>
  <div>
    <!--  :model="form" -->
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" >
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <!--  :model="form" -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in spuAttrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item> 
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <!--  :model="form" -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key='saleAttrValue.id'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImgList" @selection-change="handleSelectionChange" >
          <el-table-column
            type="selection"
            align="center"
            prop="prop"
            label="label"
            width="60"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // spu 信息
      spu:{},   
      // 图片信息
      spuImgList: [],
      // 销售属性
      spuSaleAttrList: [],
      // 平台属性
      spuAttrInfoList: [],
      // 收集 Sku数据
      skuInfo: {
        // 来源于父组件的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 双向数据绑定收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          /* {
            attrId: 0,
            attrName: "string",
            id: 0,
            skuId: 0,
            valueId: 0,
            valueName: "string",
          }, */
        ],
        // 图片
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        // 销售属性
        skuSaleAttrValueList: [
          /* {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      // 选中状态图片
      imgList:[],
    };
  },
  methods: {
    // 请求页面数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件传递的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片数据
      let imgListResult = await this.$API.spu.reqImageList(spu.id);
      if (imgListResult.code == 200) {
        let list = imgListResult.data
        list.forEach((i)=>{
          i.isDefault = 0
        })
        this.spuImgList = list;
      } else {
        return Promise.reject(new Error("获取Spu图片失败"));
      }
      // 请求销售属性
      let saleAttrListResult = await this.$API.spu.reqSaleAttrList(spu.id);
      if (saleAttrListResult.code == 200) {
        this.spuSaleAttrList = saleAttrListResult.data;
      } else {
        return Promise.reject(new Error("获取Spu销售属性失败"));
      }
      // 请求平台属性数据
      let attrInfoListResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoListResult.code == 200) {
        this.spuAttrInfoList = attrInfoListResult.data;
      }
    },
    // 图片表格数据
    handleSelectionChange(params){
      // params 参数收集到的是选中状态的列数据    除此外还需要收集是否为默认状态
      this.imgList = params
    },
    // 排它
    changeDefault(row){
      this.spuImgList.forEach((i)=>{
        i.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消点击事件
    cancle(){
      Object.assign(this._data,this.$options.data())
      this.$emit('turnScene')
    },
    // 保存点击事件
    async saveData(){
      // 整理平台属性参数
      const {spuAttrInfoList,skuInfo,spuSaleAttrList,imgList} = this
      /* spuAttrInfoList.forEach((i)=>{
        if(i.attrIdAndValueId){
          const [attrId,valueId] = i.attrIdAndValueId.split(':')
          // 参数应为对象
          let obj = {valueId,attrId} 
          skuInfo.skuAttrValueList.push(obj)
        }
      }) */
      // 平台属性
      skuInfo.skuAttrValueList = spuAttrInfoList.reduce((prev,i)=>{
        if(i.attrIdAndValueId){
          const [attrId,valueId] = i.attrIdAndValueId.split(':')
          prev.push({valueId,attrId})
        }
        return prev
      },[])
      // 销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,i)=>{
        if(i.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = i.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 图片属性
      skuInfo.skuImageList = imgList.map((i)=>{
        return {
          imgName:i.imgName,
          imgUrl:i.imgUrl,
          isDefault:i.isDefault,
          spuImgId:i.id,
        }
      })
      // 发送请求
      let result = await this.$API.spu.reqSaveSkuInfo(skuInfo)
      if(result.code==200){
        this.$message({type:'success',message:'添加成功'})
        // Object.assign(this._data,this.$options.data())
        // this.$emit('turnScene')
        this.cancle()
      }
    },
  },
};
</script>

<style>
</style>