import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes,resetRouter,asyncRoutes,constantRoutes } from '@/router'
import router from '@/router';
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 服务器返回的菜单信息{根据不同的角色 但会的标记信息 数组里面的元素是字符串}
    routes:[],
    // 角色信息
    roles:[],
    // 按钮权限信息
    buttons:[],
    // 对比之后 {项目中已有的异步路由 与服务器返回的标记信息进行对比最终需要展示的路由}
    resultAsyncRoutes:[],
    // 用户最终需要展示全部路由
    resultAllRputes:[],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  /* SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  } */
  // 存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 计算出最终的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    // vuex保存当前用户的异步路由 注意 一个用户需要展示完成路由 常量 异步 任意路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示所有路由
    state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    //给路由器添加新的路由  addRoutes  封装了一个自定义函数   解决重复添加问题
    router.selfaddRoutes(state.resultAllRputes)
  },
}
// router.selfaddRoutes = function (params){
//   router.matcher = new Router().matcher;
//   router.addRoutes(params)
// }
// 定义一个函数 两个数组进行对比 对比出当前用户到底显示那些异步路由
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  // 过滤出当前用户 需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // 数组当中没有这个元素返回值-1 有则不是负一
    if(routes.indexOf(item.name)!=-1){
      // 递归 不要忘记还有2,3,4,5,6级路由
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}
const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // console.log(result)
    if(result.code == 20000){
      const { data } = result
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('登录失败'))
    }
    /* 原作者 内容
      return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    }) 
    */
  },

  // get user info
  async getInfo({ commit, state }) {
    /* let result = await getInfo(state.token)
    // 获取用户信息 返回数据包含 用户名name|用户头像avatar|routes{返回的标志 不同用户应该
  // 展示那些菜单的标记}|roles{用户角色信息}|buttons{按钮的信息 按钮权限用的标记}
    if(result.code == 20000){
      const { data } = result
      if(!data){
        return Promise.reject(new Error('Verification failed, please Login again.'))
      }
      // vuex储存用户全部信息
      commit('SET_USERINFO',data)
      commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
      // const { name, avatar } = data
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // 不确定这里的return和resolve(data)会不会产生差异  后者可以被获取到data
      // return 'ok'
      // 既然如此就换种写法 这种写法应该同作者写的无差别 都会将data返回 不管用不用
      return Promise.resolve(data)
    }else{
      return Promise.reject(new Error('获取用户信息失败'))
    } */
    // 原作者 内容
      return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

      commit('SET_USERINFO',data)
      commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes));
      // commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
      // const { name, avatar } = data
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
       /*  if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar) */
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    }) 
   
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token)
    // console.log(result)
    if(result.code == 20000){
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return '登出成功'
    }else{
      return Promise.reject(new Error('登出失败'))
    }
    /* 原作者 内容
      return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    }) 
    */
  },

  // remove token
  async resetToken({ commit }) {
    let result = await removeToken() // must remove  token  first
    if(result.code == 20000){
      commit('RESET_STATE')
      return '移除token成功'
    }else{
      return Promise.reject(new Error('移除token失败'))
    }
    /* 原作者 内容
      return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    }) 
    */
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

