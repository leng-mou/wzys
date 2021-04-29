<template>
  <div class="refuseTask">
      <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>验收管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/execute' }">验收执行</el-breadcrumb-item>
        <el-breadcrumb-item>取消</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div>
                <el-form ref="refuseForm" :rules="refuseRules" :model="refuseForm" label-width="120px">
                    <el-row>
                      <el-col :span="12">
                          <el-form-item label="验收拒收备注" prop="task_note">
                            <el-input type="textarea" v-model="refuseForm.task_note"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>
                    
                    <el-row>
                      <el-col :span="12">
                           <el-form-item label-width="120px" label="请选择图片">
                                <el-upload 
                                ref="refuseUpload"
                                action="#"
                                multiple
                                accept="image/png,image/gif,image/jpg,image/jpeg"
                                list-type="picture-card"
                                :auto-upload="false"
                                :before-upload="handleBeforeUpload"
                                :http-request="refuseUpload"
                                >
                                <i class="el-icon-plus"></i>
                                </el-upload>
                           </el-form-item>
                      </el-col>
                    </el-row>
                   

                    <el-row>
                      <el-col :span="24" :offset="18">
                          <el-form-item>
                            <el-button type="primary" @click="refuse">确 定</el-button>
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
    name:'RefuseTask',
    data(){
        return {
            refuseDialogVisible:false,
            refuseForm:{
                task_note:'',
                task_id:this.$route.params.id
            },
            files:[],
            refuseRules:{
                task_note:[
                    { required: true, message: '请填写拒收备注', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        async showRefuseDialog(){
                const result = await this.$confirm(
                "是否确认拒收?",
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

                this.refuseDialogVisible=!this.refuseDialogVisible
        },
        refuseUpload(param){
            this.files.push(param.file)
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
        refuse() {
            this.$refs.refuseForm.validate(async valid=>{
                if (!valid) return

                let fd = new FormData();
                this.$refs.refuseUpload.submit() // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件 
                this.files.forEach(function (file) {
                    fd.append('file', file, file.name); 
                })
                fd.append('token',sessionStorage.getItem('token'));
                fd.append('task_id',this.refuseForm.task_id);
                fd.append('task_note',this.refuseForm.task_note);
                if(this.refuseForm.task_note =='') return this.$message('验收拒绝备注不能为空')
                // 网络请求
                const {data:res}= await this.$http.post('check/end_rejection/',fd,{
                    headers:{'Content-Type':'multipart/form-data'}
                })
                if (res.code !== 200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.refuseDialogVisible=false
                this.$router.push('/execute')
                })
        },
        refuseClosed(){
            this.$refs.refuseForm.resetFields()
            this.$refs.refuseUpload.clearFiles()
        },
    }
}

</script>
<style scoped>
</style>