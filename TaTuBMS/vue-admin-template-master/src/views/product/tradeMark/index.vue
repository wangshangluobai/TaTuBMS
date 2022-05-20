<template>
  <div>
    <!-- 按钮 少增加了外边距10px 0 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 
    data 表格组件将来需要展示的数据---数组类型 
    border 给表格添加边框
    column 属性
    label 实现标题
    width 对应列的宽度
    align 标题的对齐方式
     -->
    <el-table style="width: 100%" :data="list" border>
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <!-- ,$index 这里不能使用其他名字 -->
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <!-- slot-scope="{row}" -->
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)"
            >修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    四大属性 1.当前第几页 2.数据总条数 3.每一页展示条数 4. 连续页码数
    current-page 当前第几页
    total 数据总条数
    page-size 每一页展示条数
    page-sizes 可以设置每一页展示多少条数据
    layout 可以实现分页器布局
    pager-count 按钮的数量 包括前后两个  其连续按钮数量为 x-2 
    样式写法是驼峰textAlign 注意
     -->
    <el-pagination
      style="margin-top: 20px; textAlign: center"
      @size-change="handleSizeChange"
      @current-change="getTradeMarkData"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->, total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框
     
      -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性 这个属性的作用是 把表单的数据收集到tmForm对象的身上 表单验证也需要该属性 -->
      <el-form style="width:85%" :model="tmForm" :rules="rules" ref="ruleFrom" >
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmName" ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- 这里收集数据 不能使用v-model 因为不是表单元素
          action 设置图片上传的地址
          :on-success:可以检测到图片上传成功 当上传成功 会执行一次
          :before-upload 可以在上传图片之前 执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    var validateTmName = (rule, value, callback) =>{
      // 自定义校验规则
      if(value.length < 2 || value.length >10) {
        callback(new Error('请输入2~10位字符的品牌名称'));
      }else {
        callback();
      }
    }
    return {
      // 当前页数 默认为1
      page: 1,
      // 当前页数展示数据条数 默认为5
      limit: 3,
      // 品牌总数据 请求后的数据
      total: 0,
      // 品牌详细信息
      list: [],
      // 显示或隐藏对话框
      dialogFormVisible:false,
      // 收集品牌信息
      tmForm:{
        // 对象身上的属性 需要对照文档设定 不然与后端不符便无法获取数据
        tmName:'',
        logoUrl:'',
      },
      // 表单验证规则
      rules:{
        // required 必须要校验字段  message 提示信息  trigger 用户行为设置(blur失去焦点&change当文本发生变化时)
        tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            // 自定义校验
            { validator:validateTmName, trigger: 'change' },
            // 官方提供校验方式
            // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
        logoUrl: [
            { required: true, message: '请选择品牌LOGO', trigger: 'change' }
          ],
      },
    };
  },
  methods: {
    // 封装派发品牌数据请求
    async getTradeMarkData(newPage = 1) {
      this.page = newPage;
      const { limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(newPage, limit);
      // console.log(result)
      if (result.code == 200) {
        let { data } = result;
        // let { total, list } = this;
        this.total = data.total;
        this.list = data.records;
        return "ok";
      } else {
        return Promise.reject(new Error("获取商品数据失败"));
      }
    },
    // 当分页器某一页需要展示数据调速发生变化时触发
    handleSizeChange(limit) {
      // 更新展示页面 条数
      this.limit = limit;
      this.getTradeMarkData();
    },
    // 弹出添加对话框  
    showDialog(){
      // 显示对话框
      this.dialogFormVisible = true
      // 老师是在这里对上传信息进行清理 但我在点击修改时 会有残留信息
      // 在没有做修改功能时确实会有残留信息 但是完善修改功能之后 
      // 点击修改按钮残留信息会被新的数据覆盖 不构成bug
      // 清除本次残留数据
      this.tmForm = {tmName:'',logoUrl:''}
    },
    // 弹出修改对话框
    updateTradeMark(row){
      // 显示对话框
      this.dialogFormVisible = true
      // 展示被修改的 品牌和图片
      // row 是用户点击对应的名称和logo  重点  浅复制
      this.tmForm = {...row};
    },
    // 删除品牌信息   同样传参 获取需要删除的品牌信息
    deleteTradeMark(row){
      // 弹框提示 确认操作
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 在用户点击确认时执行
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        // console.log(result)
        if(result.code == 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 更新品牌列表  细节 细节
          // 当页面 没有数据时应当去上一页   有数据则留在当前页面
          this.getTradeMarkData(this.list.length>1?this.page:this.page-1)
        }else{
          return '删除失败'
        }
      }).catch(() => {
        // 在用户点击取消时执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 图片上传成功后
    handleAvatarSuccess(res, file) {
      // res 上传成功之后返回给前端数据
      // file 上传成功之后服务器返回给前端数据
      // 收集品牌图片数据 随请求带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 确认按钮(添加品牌|修改品牌)
    addOrUpdateTradeMark(){
      // 当全部验证字段通过 再去书写业务逻辑
      this.$refs.ruleFrom.validate(async (success)=>{
        // 符合
        if(success){
          // 关闭对话框
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          // console.log(result)
          if(result.code == 200){
            // 弹出信息 添加|修改品牌成功
            this.$message({
              type:'success',
              message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
            });
            // 重新获取品牌列表数据  判断添加|修改 前者跳转至第一页 后者留在当前页
            this.getTradeMarkData(this.tmForm.id?this.page:1);
          }
        }else{
          return false
        }
      })
    },
  },
  mounted() {
    this.getTradeMarkData();
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>