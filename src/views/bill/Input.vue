<template>
  <div class="input">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>单据录入</el-breadcrumb-item> 
      </el-breadcrumb>

      <div class="input_box">
          <div class="image">
            <img src="../../assets/images/lr.svg">
          </div>
          <div class="title">
            <span>您想通过哪种方式录入验收单信息？</span>
          </div>
          <div class="btns">
              <el-button type="primary" @click="scan">直接扫描</el-button>
			  <el-button type="primary" @click="showUploadDialog">上传PDF</el-button>
          </div>
      </div>

      <!-- 上传pdf对话框 -->
      <el-dialog title="上传PDF" :visible.sync="PdfDialogVisible" :close-on-click-modal="false" width="26%" @close="uploadClosed">
        <!-- 上传文件区域 -->
        <div class="uploadContainer">
            <el-upload
            ref="upload"
            drag
            action="#"
            multiple
            accept=".pdf"
            :auto-upload="false"
            :limit=limitNum
            :on-exceed="handleExceed"
            :before-upload="handleBeforeUpload"
            :http-request="handleRequest"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传小于10M的pdf文件</div>
        </el-upload>
        </div>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="PdfDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="uploadFile">确 定</el-button>
        </span>
      </el-dialog>

      <!-- pdf表单对话框 -->
      <el-dialog title="pdf识别表单" :visible.sync="formDialogVisible" :close-on-click-modal="false" top="12vh" width="80%">
        <!-- 表单区域 -->
        <el-form :model="addForm" label-position="left" label-width="130px" >
            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="采购订单号(ERP) :">
                        <el-input v-model="addForm.order_id_erp"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购订单号(电商) :">
                        <el-input v-model="addForm.order_id_ec"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="协议编号 :">
                        <el-input v-model="addForm.contr_id"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <el-row :gutter="40">
                <el-col :span="9">
                    <el-form-item label="协议编号 :">
                        <el-input v-model="addForm.contr_id"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> -->

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="请购单标题 :">
                        <el-input v-model="addForm.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="采购商名称 :">
                        <el-input v-model="addForm.buy_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购商联系人 :">
                        <el-input v-model="addForm.buy_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购商电话 :">
                        <el-input v-model="addForm.buy_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="供应商名称 :">
                        <el-input v-model="addForm.sup_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商联系人 :">
                        <el-input v-model="addForm.sup_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商电话 :">
                        <el-input v-model="addForm.sup_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="承运商名称 :">
                        <el-input v-model="addForm.tran_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运商联系人 :">
                        <el-input v-model="addForm.tran_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运商电话 :">
                        <el-input v-model="addForm.tran_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="订单总金额 :">
                        <el-input v-model="addForm.money"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收货地址 :">
                        <el-input v-model="addForm.rec_loc"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <el-row :gutter="40">
                <el-col :span="9">
                    <el-form-item label="收货地址 :">
                        <el-input v-model="addForm.rec_loc"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="formDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBill">确 定</el-button>
        </span>
      </el-dialog>
     
      <!-- 扫描仪表单对话框 -->
      <el-dialog title="扫描仪识别表单" :visible.sync="scanDialogVisible" :close-on-click-modal="false" top="12vh" width="80%">
        <!-- 表单区域 -->
        <el-form :model="scanForm" label-position="left" label-width="130px" >
            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="采购订单号(ERP) :">
                        <el-input v-model="scanForm.order_id_erp"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购订单号(电商) :">
                        <el-input v-model="scanForm.order_id_ec"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="协议编号 :">
                        <el-input v-model="scanForm.contr_id"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="请购单标题 :">
                        <el-input v-model="scanForm.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="采购商名称 :">
                        <el-input v-model="scanForm.buy_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购商联系人 :">
                        <el-input v-model="scanForm.buy_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购商电话 :">
                        <el-input v-model="scanForm.buy_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="供应商名称 :">
                        <el-input v-model="scanForm.sup_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商联系人 :">
                        <el-input v-model="scanForm.sup_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商电话 :">
                        <el-input v-model="scanForm.sup_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="承运商名称 :">
                        <el-input v-model="scanForm.tran_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运商联系人 :">
                        <el-input v-model="scanForm.tran_cont"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运商电话 :">
                        <el-input v-model="scanForm.tran_tel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="订单总金额 :">
                        <el-input v-model="scanForm.money"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收货地址 :">
                        <el-input v-model="scanForm.rec_loc"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="scanDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitScan">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="完成扫描" :visible.sync="sureDialogVisible" :close-on-click-modal="false" top="35vh" width="20%">
        <!-- 表单区域 -->
         确认完成扫描
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="sureDialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="finishScan">确 定</el-button>
        </span>
      </el-dialog>


  </div>
</template>

<script>
export default {
    name:'Input',
    data(){
      return {
          PdfDialogVisible:false,
          formDialogVisible:false,
          addForm:{},
          hideUpload:false,
          limitNum:1,
          //随机数
          num:'',
          scanDialogVisible:false,
          scanForm:{},
          sureDialogVisible:false,
          m:''  
      }
    },
    methods:{
      // 对接扫描仪  
      scan(){
            var num = "";   //定义用户编号
            for (var i = 0; i < 4; i++) //4位随机数，用以加在时间戳后面。
            {
                num += Math.floor(Math.random() * 10);
            }
            num = new Date().getTime() + num;  //时间戳，用来生成用户编号
            this.num=num
            this.sureDialogVisible=!this.sureDialogVisible
            var url = this.$http.defaults.baseURL+'/receipt/scan_view?mark='+num
    	    window.location.href = "openIE:" + url
      },
      //确认弹窗获取数据   
      async finishScan(){
         this.sureDialogVisible=!this.sureDialogVisible
         //调接口获取扫描数据
         const { data: res } = await this.$http.get("receipt/scan_ocr/",{params:{mark:this.num}})
         if(res.code !==200) return this.$message({type:'error',message:res.message})
         this.$message({type:'success',message:res.message})
         this.scanForm=res.data
         this.scanDialogVisible=!this.scanDialogVisible
      },
      //提交扫描表单
     async submitScan(){
         this.scanForm.mark=this.num
         const { data: res } = await this.$http.post("receipt/add/", this.scanForm)
         if(res.code !==200) return this.$message({type:'error',message:res.message})
         this.$message({type:'success',message:res.message})
         this.scanDialogVisible=!this.scanDialogVisible 
      },  
      // 展示上传pdf对话框
      showUploadDialog(){
          this.PdfDialogVisible=!this.PdfDialogVisible
      },
      // 上传pdf识别表单
     async addBill(){
         this.addForm.mark=this.m
         this.addForm.token=window.sessionStorage.getItem('token')
         const { data: res } = await this.$http.post("receipt/add/", this.addForm)
         if(res.code !==200) return this.$message({type:'error',message:res.message})
         this.$message({type:'success',message:res.message})
         this.formDialogVisible=false 
         this.$router.push('/execute')     
      },
     async handleBeforeUpload(file){
             const isPDF=file.type === 'application/pdf';
            if (!isPDF) {
                this.$notify.warning({
                title: '警告',
                message: '请上传格式pdf格式的文件'
                })
                return false
            }
            const isLt5M = file.size / 1024 / 1024 <10;
            if (!isLt5M) {
                this.$notify.warning({
                title: '警告',
                message: '文件大小必须小于10M'
              })
              return  false
            }
            return isPDF && isLt5M
            // let fd = new FormData();
            // fd.append("file", file); 
            // fd.append('token',sessionStorage.getItem('token'));

            // // 网络请求
            // const {data:res}= await this.$http.post('receipt/re_ocr/',fd,{
            //     headers:{'Content-Type':'multipart/form-data'}
            // })
            // if(res.code !==200) return this.$message({type:'error',message:res.message})
            // this.$message({type:'success',message:res.message}) 
            // this.addForm=res.data
            // this.PdfDialogVisible=!this.PdfDialogVisible
            // this.formDialogVisible=!this.formDialogVisible
      },
      handleExceed (files, fileList) {
         this.$message.error("只能上传单个文件");
      },
      uploadClosed(){
          this.$refs.upload.clearFiles()
      },
    //   自定义上传
     async handleRequest(param){
            var m = "";   //定义用户编号
            for (var i = 0; i < 4; i++) //4位随机数，用以加在时间戳后面。
            {
                m += Math.floor(Math.random() * 10);
            }
            m = new Date().getTime() + m;  //时间戳，用来生成用户编号
            this.m=m

            let fd = new FormData();
            fd.append("file", param.file); 
            fd.append('token',sessionStorage.getItem('token'));
            fd.append("mark", m); 
            // 网络请求
            const {data:res}= await this.$http.post('receipt/re_ocr/',fd,{
                headers:{'Content-Type':'multipart/form-data'}
            })
            if(res.code !==200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message}) 
            this.addForm=res.data
            this.PdfDialogVisible=!this.PdfDialogVisible
            this.formDialogVisible=!this.formDialogVisible
      },
      uploadFile(){
          this.$refs.upload.submit()
      }
    },
    created(){
        
    }
}

</script>
<style scoped lang="scss">
.input{
  height: 100%;
  position: relative;
  .input_box{
    position: absolute;
    width: 100%;
    color: #456;
    height: 400px;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    .image{
      width: 200px;
      height: 200px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,0%);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .title{
      font-size: 20px;
      position: absolute;
      left: 50%;
      top:60%;
      transform: translate(-50%,0%);
    }
    .btns{
      position: absolute;
      left:50%;
      top:80%;
      transform: translate(-50%,0%);
      .el-button:nth-child(2){
        margin-left: 80px;
      }
    }
  }
  .uploadContainer{
    margin:0 auto;
   ::v-deep .el-upload{
        width: 100%  !important;
        .el-upload-dragger{
            width:100%  !important ;
        } 
    }
  }
}


</style>