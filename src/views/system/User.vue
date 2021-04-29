<template>
  <div class="user">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item> 
    </el-breadcrumb>
    
    <!-- 卡片视图区域 -->
    <el-card class="user_card">
      <!-- 搜索框 -->
      <el-form :model="paramsInfo" label-position="right" label-width="80px" >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="用户名">
                <el-input v-model="paramsInfo.user_name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="真实姓名">
                <el-input v-model="paramsInfo.real_name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" icon="el-icon-search" @click="searchUser">查询</el-button>
          </el-col>

           <el-col :span="2.5">
            <el-button type="info" icon="el-icon-refresh-right" @click="resetSearch">重置</el-button>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" icon="el-icon-document-add" @click="showAddDialog">添加</el-button>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表格 -->
      <el-table :data="userList" border>
        <el-table-column label="序号" align="center" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="用户名" align="center" prop="user_name"></el-table-column>
        <el-table-column label="真实姓名" align="center" prop="real_name"></el-table-column>
        <el-table-column label="工号" align="center" prop="job_num"></el-table-column>
        <el-table-column label="部门" align="center" prop="dep"></el-table-column>
        <el-table-column label="电话" align="center" prop="tel"></el-table-column>
        <el-table-column label="角色" align="center" prop="group"></el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="160">
          <template v-slot="scope">
            <el-switch 
            v-model="scope.row.status"
            active-value="启用"	
	          inactive-value="禁用"
            active-text="启用"
            inactive-text="禁用"
            @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUser(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="重置密码" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="resetPassword(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户列表对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%" @close="addClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="addForm.user_name" placeholder="长度在 1 到 10 个字符"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="addForm.real_name" placeholder="长度在 1 到 10 个字符"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="job_num">
            <el-input v-model="addForm.job_num" placeholder="长度在 5 到 10 个字符"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="dep">
            <el-input v-model="addForm.dep" placeholder="长度在 2 到 10 个字符"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="addForm.tel" placeholder="长度为11个字符"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="addForm.group"  placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.group"
                :label="item.label"
                :value="item.group">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" :close-on-click-modal="false" width="30%" @close="editClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="editForm.user_name" disabled></el-input>
          </el-form-item>

          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="editForm.real_name" disabled></el-input>
          </el-form-item>

          <el-form-item label="工号" prop="job_num">
            <el-input v-model="editForm.job_num" disabled></el-input>
          </el-form-item>

          <el-form-item label="部门" prop="dep">
            <el-input v-model="editForm.dep"></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="tel">
            <el-input v-model="editForm.tel"></el-input>
          </el-form-item>

          <el-form-item label="角色">
            <el-select v-model="editForm.group"  placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.group"
                :label="item.label"
                :value="item.group">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { downloadFile } from '@/util/downloadFile.js'
// import axios from 'axios'
export default {
    name:'User',
    data(){
        // 校验手机的规则
        var checkPhone = (rule, value, cb) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regPhone.test(value)) {
            return cb();
        }
        cb(new Error("请输入合法的手机号"));
        };
        return {
            // 用户列表参数对象
            paramsInfo:{
                user_name:'',
                real_name:'',
                pagenum:1,
                pagesize: 5,
            },
            // 用户列表数据
            userList:[],
            // 用户总数
            total:0,
            dialogVisible:false,
            // 添加用户参数对象
            addForm:{
                user_name:'',
                real_name:'',
                job_num:'',
                dep:'',
                tel:'',
                group:''
            },
            // 添加用户表单验证规则
            addrules:{
                user_name:[
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    {
                        min: 1,
                        max: 10,
                        message: "长度在 1 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                real_name:[
                    { required: true, message: "请输入真实姓名", trigger: "blur" },
                    {
                        min: 1,
                        max: 10,
                        message: "长度在 1 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                job_num:[
                    { required: true, message: "请输入工号", trigger: "blur" },
                    {
                        min: 5,
                        max: 10,
                        message: "长度在 5 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                dep:[
                    { required: true, message: "请输入部门", trigger: "blur" },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                tel:[
                    { required: true, message: "请输入手机", trigger: "blur" },
                    { validator: checkPhone, trigger: "blur" },
                ],
            },
            // 编辑用户参数对象
            editForm:{
                user_name:'',
                real_name:'',
                job_num:'',
                dep:'',
                tel:'',
                group:''
            },
            editDialogVisible:false,
            // 编辑用户表单验证规则
            editFormRules:{
                    user_name:[
                        { required: true, message: "请输入用户名", trigger: "blur" },
                        {
                            min: 1,
                            max: 10,
                            message: "长度在 1 到 10 个字符",
                            trigger: "blur",
                        },
                    ],
                    real_name:[
                        { required: true, message: "请输入真实姓名", trigger: "blur" },
                        {
                            min: 1,
                            max: 10,
                            message: "长度在 1 到 10 个字符",
                            trigger: "blur",
                        },
                    ],
                    dep:[
                        { required: true, message: "请输入部门", trigger: "blur" },
                        {
                            min: 2,
                            max: 10,
                            message: "长度在 2 到 10 个字符",
                            trigger: "blur",
                        },
                    ],
                    tel:[
                        { required: true, message: "请输入手机", trigger: "blur" },
                        { validator: checkPhone, trigger: "blur" },
                    ],
            },
            // 用户角色列表
            roles:[],
        }
    },
    methods:{
        // 表格序号
        indexMethod(index){
          return (index+1)+(this.paramsInfo.pagenum-1)*this.paramsInfo.pagesize
        },
        // 显示添加用户对话框
        showAddDialog(){
            this.dialogVisible=!this.dialogVisible
        },
        // 获取用户列表数据
       async getUsersInfo(){
         const {data:res}=await this.$http.get('/user/search_data/',{params:this.paramsInfo})
         if(res.code !==200) this.$message({type:'error',message:res.message})
         this.userList=res.data.current_page_data
         this.total=res.data.data_sum
        },
        // 查询用户
        searchUser(){
            this.paramsInfo.pagenum=1
            this.getUsersInfo()
        },
        // 重置添加用户表单
        addClosed(){
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if (!valid) return
                const { data: res } = await this.$http.post("/user/register/", this.addForm)
                if(res.code !==200) return this.$message({type:'error',message:res.message}) 
                this.$message({type:'success',message:res.message})
                this.dialogVisible=!this.dialogVisible
                this.getUsersInfo()
            })
        },
        handleSizeChange(newSize){
            this.paramsInfo.pagesize=newSize
            this.getUsersInfo()
        },
        handleCurrentChange(newPage){
            this.paramsInfo.pagenum=newPage
            this.getUsersInfo()
        },
        // 删除用户列表
       async removeUser(id){
            const result = await this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }
            ).catch((error) => {
                return error;
            });
            if (result !== "confirm") {
                return this.$message.info("已取消删除")
            }

            //发请求调用接口删除用户
            const { data: res } = await this.$http.post("/user/delete/",{id:id})
            if (res.code !== 200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
            this.getUsersInfo()
        },
        // 显示编辑用户列表对话框
        showEditDialog(row){
           this.editDialogVisible=!this.editDialogVisible
           this.editForm=row
           this.getUsersInfo()
        },
        // 重置编辑用户表单验证规则
        editClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 编辑用户列表
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return 
                const {data:res}=await this.$http.post('/user/change/',this.editForm)
                if(res.code!==200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.editDialogVisible=!this.editDialogVisible
                this.getUsersInfo()
            })
        },
        // 重置用户密码
      async  resetPassword(id){
          const result = await this.$confirm(
                "此操作将重置该用户密码为000000, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }
            ).catch((error) => {
                return error;
            });
            if (result !== "confirm") {
                return this.$message.info("已取消删除");
            }
            // 发请求重置密码
          const {data:res}=await this.$http.post('user/reset_password/',{id:id})
          if(res.code !==200) return this.$message({type:'error',message:res.message})
          this.$message({type:'success',message:res.message})
        },
        // 获取用户角色选项数组
       async getRoles(){
          const {data:res}=await this.$http.get('user/group_name_data/')
          this.roles=res.data
        },
        // 改变状态
       async userStateChanged(row){
            let id=row.id
            let status=row.status
            const {data:res}=await this.$http.post('user/status_name_change/',{id,status})
            if(res.code !==200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
        },
        // 重置搜索框
        resetSearch(){
          this.paramsInfo.user_name='',
          this.paramsInfo.real_name=''
        },
        // 导出excel表格
       async exportExcel(){
        // await axios({
        //     method:"get",
        //     url:"http://192.168.2.58:8080/user/excel_download",
        //     params:this.paramsInfo, 
        //     responseType: 'blob'
        //  }).then(res=>{
        //    console.log(res)
        //    downloadFile(res,  '用户列表.xls');
        //  })
        const res=await this.$http.get('user/excel_download/',{
          params:this.paramsInfo,
          responseType: 'blob'
        })
        downloadFile(res,'用户列表.xlsx');
        },
    },
    created(){
        this.getUsersInfo()
        this.getRoles()
    }
}

</script>
<style scoped lang="scss">
.el-pagination{
    margin-top:15px;
}

.el-row .el-col:nth-child(5){
  margin-left: 15%;
}
</style>