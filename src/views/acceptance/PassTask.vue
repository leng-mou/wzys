<template>
  <div class="passTask">
       <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>验收管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/execute' }">验收执行</el-breadcrumb-item>
        <el-breadcrumb-item>通过</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <div>
                <el-form ref="passForm" :rules="passRules"  :model="passForm" label-width="120px">
                    
                    <el-row>
                      <el-col :span="12">
                          <el-form-item label="验收通过备注" prop="task_note">
                            <el-input type="textarea" v-model="passForm.task_note"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>
                    
                    <el-row>
                      <el-col :span="12">
                          <el-form-item label-width="120px" label="请选择图片">
                                <el-upload 
                                ref="passUpload"
                                action="#"
                                multiple
                                accept="image/png,image/gif,image/jpg,image/jpeg"
                                list-type="picture-card"
                                :auto-upload="false"
                                :before-upload="handleBeforeUpload"
                                :http-request="passUpload"
                                >
                                <i class="el-icon-plus"></i>
                                </el-upload>
                          </el-form-item>
                      </el-col>
                    </el-row>
                    
                    <el-row>
                      <el-col :span="24" :offset="18">
                          <el-form-item>
                            <el-button type="primary" @click="pass">确 定</el-button>
                          </el-form-item>
                      </el-col>
                    </el-row>
                </el-form> 
            </div>
        </el-card>
  </div>
</template>

<script>
export default {
    name:'PassTask',
    data(){
        return {
            task_id:this.$route.params.id,
            passDialogVisible:false,
            passForm:{
                task_note:'',
                task_id:this.$route.params.id
            },
            file:[],
            passRules:{
                task_note:[
                    { required: true, message: '请填写通过备注', trigger: 'blur' }
                ]
            },
        }
    },
    methods:{
        async showPassDialog(){
                const result = await this.$confirm(
                "是否确认通过?",
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
                    return this.$message.info("已取消")
                }

                this.passDialogVisible=!this.passDialogVisible
        },
        handleBeforeUpload (file) {
            const isJPG = file.type === 'image/jpeg' ||file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        passUpload(param){
            this.file.push(param.file)
        },
        pass() {
            this.$refs.passForm.validate(async valid=>{
                if (!valid) return

                let fd = new FormData();
                this.$refs.passUpload.submit() // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件 
                this.file.forEach(function (file) {
                    fd.append('file', file, file.name); 
                })
                fd.append('token',sessionStorage.getItem('token'));
                fd.append('task_id',this.passForm.task_id);
                fd.append('task_note',this.passForm.task_note);
                const {data:res}= await this.$http.post('check/end_pass/',fd,{
                    headers:{'Content-Type':'multipart/form-data'}
                })
                if (res.code !== 200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.passDialogVisible=false
                this.$router.push(`/sign/${this.task_id}`)
            })
            
        },
        passClosed(){
            this.$refs.passUpload.clearFiles()
            this.$refs.passForm.resetFields()
        },
    },
    created(){
        
    }
}

</script>
<style scoped>
</style>