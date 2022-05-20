// 平台属性管理模块请求文件
import request from '@/utils/request';

// 获取一级分类数据   /admin/product/getCategory1  get       reqAddOrUpdateAttrInfo
export const reqFirstListData = ()=>request({url:'/admin/product/getCategory1',method:'get'})
// 获取二级分类数据   /admin/product/getCategory2/{category1Id}  get
export const reqSecondLevelData = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
// 获取三级分类数据   /admin/product/getCategroy3/{category2Id}  get
export const reqThreeLevelData = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})
// 获取平台属性接口  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// 添加属性与属性值接口   /admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttrInfo = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})