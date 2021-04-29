<template>
  <div class="cancelTask">
      <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>验收管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/execute' }">验收执行</el-breadcrumb-item>
        <el-breadcrumb-item>取消</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            
            <el-form ref="cancelForm" :rules="cancelRules" :model="form" label-width="80px">
                
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="取消原因" prop="task_note">
                            <el-input type="textarea" v-model="form.task_note"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24" :offset="18">
                        <el-form-item>
                            <el-button type="primary" @click="cancel">确 定</el-button> 
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            
        </el-card>
  </div>
</template>

<script>
export default {
    name:'CancelTask',
    data(){
        return {
            task_id:this.$route.params.id,
            cancelDialogVisible:false,
            form:{
               task_note:'',
               task_id:this.$route.params.id 
            },
            cancelRules:{
                task_note:[
                    { required: true, message: '请填写取消原因', trigger: 'blur' }
                ]
            },
        }
    },
    methods:{
         async showCancelDialog(){
            const result = await this.$confirm(
                "是否确认取消?",
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
            this.cancelDialogVisible=!this.cancelDialogVisible
        },
       async cancel(){
            this.$refs.cancelForm.validate(async valid=>{
                if (!valid) return
                const { data: res } = await this.$http.post("/check/end_cancel/",this.form)
                if (res.code !== 200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.cancelDialogVisible=!this.cancelDialogVisible
                this.$router.push('/execute')
            })
            
        },
        cancelClosed(){
            this.$refs.cancelForm.resetFields()
        },
    }
}

</script>
<style scoped>
</style>