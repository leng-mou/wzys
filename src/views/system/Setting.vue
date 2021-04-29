<template>
  <div class="setting">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
         <div class="setting_nvr">
            <div class="nvr_title"><h4>NVR参数设置</h4></div>
            
            <el-form :model="setForm" :rules="setFormRules" ref="setFormRef" label-width="120px">
              <el-form-item label="NVR  IP地址 :" prop="DVRIPAddress">
                <el-input v-model="setForm.DVRIPAddress"></el-input>
              </el-form-item>

              <el-form-item label="NVR  端口号 :" prop="DVRPortNumber">
                <el-input v-model="setForm.DVRPortNumber"></el-input>
              </el-form-item>

              <el-form-item label="NVR  用户名 :" prop="DVRUserName">
                <el-input v-model="setForm.DVRUserName"></el-input>
              </el-form-item>

              <el-form-item label="NVR  密码 :" prop="DVRPassword">
                <el-input v-model="setForm.DVRPassword"></el-input>
              </el-form-item>

              <el-form-item label="有效通道号 :" prop="downChanNum">
                <el-input v-model="setForm.downChanNum"></el-input>
              </el-form-item>

              <el-form-item label="视频截图数 :" prop="DVRPhoto">
                <el-input v-model="setForm.DVRPhoto"></el-input>
              </el-form-item>
            </el-form>

            <div>
              <el-button type="primary" @click="editNVR">修改</el-button>
            </div>
         </div>
      </el-card>
  </div>
</template>

<script>
export default {
    name:'Setting',
    data(){
      return {
        setForm:{},
        setFormRules:{
            DVRPhoto:[
              { required: true, message: "请输入视频截图数", trigger: "blur" },
              {
                min: 1,
                max: 2,
                message: "数量为1-20",
                trigger: "blur",
              },
            ]
        }
      }
    },
    methods:{
       async getNVRInfo(){
          const {data:res}=await this.$http.get('/system/search/')
          if(res.code !==200) this.$message({type:'error',message:res.message})
          if(res.data){
              this.setForm=res.data
          }
        },
       editNVR(){
          this.$refs.setFormRef.validate(async valid=>{
            if (!valid) return
            const {data:res}=await this.$http.post('/system/update/',this.setForm)
            if(res.code !==200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
            this.getNVRInfo()
          })
        }
    },
    created(){
        this.getNVRInfo()
    }
}

</script>
<style scoped lang="scss">
  .setting_nvr{
    width: 40%;
    margin: 0 auto;
    text-align: center;
    .nvr_title{
      text-align: center;
      padding-bottom: 10px;
    }
  }
</style>