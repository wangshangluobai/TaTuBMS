// 该模块用于获取品牌管理的数据
import request from '@/utils/request'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
// 添加品牌  /admin/product/baseTrademark/save  post  参数 品牌名称 品牌logo
// 修改品牌  /admin/product/baseTrademark/update  put  参数 id 品牌名称 品牌logo
// 上传新的信息不需要 携带ID   操作服务器的信息需要携带ID
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
  // 参数中携带ID ---> 走修改请求
  if(tradeMark.id){
    return request({url:'/admin/product/baseTrademark/update',data:tradeMark,method:'put'
  })
  }else{
    return request({url:'/admin/product/baseTrademark/save',data:tradeMark,method:'post'})
  }
} 
// 删除品牌信息  /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id)  =>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
