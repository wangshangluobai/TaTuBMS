// 引入request
import request from '@/utils/request'

// 获取spu列表数据的接口   /admin/product/{page}/{limit}  get
export const reqSpuList =(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
// 获取Spu信息   /admin/product/getSpuById/{spuId}  get
export const reqSpuById =(spuId) =>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
// 获取品牌的信息   /admin/product/baseTrademark/getTrademarkList   get
export const reqTrademarkList =() =>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'}) 
// 获取Spu图标的接口   /admin/product/spuImageList/{spuId} get
export const reqSpuImageList =(spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
// 获取平台全部销售属性  只有三个   /admin/product/baseSaleAttrList   get
export const reqBaseSaleAttrList = () =>request({url:'/admin/product/baseSaleAttrList',method:'get'})
// 修改||添加SPU  修改和添加 携带的参数唯一的区别就是参数是否带Id
export const reqAddOrUpdateSpu = (spuInfo)=>{
  // 参数有Id  修改spu
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
  }else{
    // 参数不带Id
    return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
  }
}
// 删除spu数据   /admin/product/deleteSpu/{spuId}  delete
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})
// 获取图片的数据   /admin/product/spuImageList/{spuId}   get   reqImageList
export const reqImageList =(spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
// 获取销售属性的数据   /admin/product/spuSaleAttrList/{spuId}   get
export const reqSaleAttrList =(spuId) =>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
// 获取平台属性的数据   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrInfoList =(category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// 添加Sku   /admin/product/saveSkuInfo   post
export const reqSaveSkuInfo = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})
// 获取Sku列表数据   /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})