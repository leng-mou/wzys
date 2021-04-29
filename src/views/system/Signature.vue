<template>
  <div class="signature">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>印章管理</el-breadcrumb-item> 
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="signature_card">
      <!-- 搜索框 -->
      <el-form :model="paramsInfo" label-position="right" label-width="80px" >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="印章名">
                <el-input v-model="paramsInfo.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="主体类型">
                <el-input v-model="paramsInfo.type"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" icon="el-icon-search" @click="searchSignature">查询</el-button>
          </el-col>

           <el-col :span="2.5">
            <el-button type="info" icon="el-icon-refresh-right" @click="resetSearch">重置</el-button>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" icon="el-icon-document-add" @click="showAddDialog">添加</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格 -->
      <el-table :data="signatureList" border ref="table">
        <el-table-column label="序号" type="index" align="center" :index="indexMethod"></el-table-column>
        <el-table-column label="印章名" align="center" prop="name" ></el-table-column>
        <el-table-column label="主体类型" align="center" prop="type"></el-table-column>
        <el-table-column label="图片" align="center" width="180">
          <template v-slot="scope">
            <el-image 
            :src="$http.defaults.baseURL+scope.row.image" 
            :preview-src-list="[$http.defaults.baseURL+scope.row.image]" 
            lazy>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="长度(cm)" align="center" prop="size_l"></el-table-column>
        <el-table-column label="宽度(cm)" align="center" prop="size_w"></el-table-column>
        <el-table-column label="颜色" align="center" prop="color"></el-table-column>
        <el-table-column label="状态" align="center" prop="status">
           <template v-slot="scope">
            <el-switch 
            v-model="scope.row.status"
            active-value="启用"	
	          inactive-value="禁用"
            active-text="启用"
            inactive-text="禁用"
            @change="signatureStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑印章" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除印章" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeSignature(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="上传图片" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-upload"
                size="mini"
                @click="showUploadDialog(scope.row.id)"
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

      <!-- 添加印章列表对话框 -->
      <el-dialog title="添加印章" :visible.sync="addDialogVisible" :close-on-click-modal="false" width="30%" @close="addClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addrules"  ref="addFormRef" label-width="100px">
          <el-form-item label="印章名" prop="name">
            <el-input v-model="addForm.name" placeholder="长度在 2 到 6 个字符"></el-input>
          </el-form-item>
          <el-form-item label="主体类型">
            <el-select v-model="addForm.type"  placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长度" prop="size_l">
            <el-input v-model="addForm.size_l" placeholder="cm"></el-input>
          </el-form-item>
          <el-form-item label="宽度" prop="size_w">
            <el-input v-model="addForm.size_w" placeholder="cm"></el-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-select v-model="addForm.color"  placeholder="请选择">
              <el-option
                v-for="item in colorList"
                :key="item.color"
                :label="item.label"
                :value="item.color">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSignature">下一步</el-button>
        </span>
      </el-dialog>

       <!-- 修改印章的对话框 -->
      <el-dialog title="修改印章" :visible.sync="editDialogVisible" :close-on-click-modal="false" width="30%" @close="editClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="印章名" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>

          <el-form-item label="主体类型">
            <el-select v-model="editForm.type"  placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="长度" prop="size_l">
            <el-input v-model="editForm.size_l"></el-input>
          </el-form-item>

          <el-form-item label="宽度" prop="size_w">
            <el-input v-model="editForm.size_w"></el-input>
          </el-form-item>

          <el-form-item label="颜色" >
            <el-select v-model="editForm.color"  placeholder="请选择">
              <el-option
                v-for="item in colorList"
                :key="item.color"
                :label="item.label"
                :value="item.color">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSignatureInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 上传印章图片对话框 -->
      <el-dialog  title="裁剪上传" destroy-on-close :visible.sync="uploadDialogVisible" :close-on-click-modal="false" width="70%">
          <corpper 
          :id="id"
          @closeUploadDialog="closeUploadDialog"
          @getSignatureInfo="getSignatureInfo"></corpper>
      </el-dialog>

      <!-- 添加印章图片对话框 -->
      <el-dialog title="添加印章图片" destroy-on-close :visible.sync="imgDialogVisible" :close-on-click-modal="false" width="70%">
          <add-corpper 
          :addId="addId"
          @closeImgDialog="closeImgDialog"
          @getSignatureInfo="getSignatureInfo"></add-corpper>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Corpper from '@/components/content/Corpper'
import addCorpper from '@/components/content/addCorpper'
export default {
    name:'Signature',
    components:{
        Corpper,
        addCorpper
    },
    data(){
      return {
        // 签章列表参数对象
        paramsInfo:{
          name:'',
          type:'',
          pagenum:1,
          pagesize: 5,
        },
        //签章数据
        signatureList:[],
        // 总数
        total:0,
        editDialogVisible:false,
        editForm:{
          name:'',
          type:'',
          size_l:'',
          size_w:'',
          color:''
        },
        editFormRules:{
            name:[
              { required: true, message: "请输入印章名", trigger: "blur" },
              {
                  min: 2,
                  max: 6,
                  message: "长度在 2 到 6 个字符",
                  trigger: "blur",
              },
            ],
            size_w:[
              { required: true, message: "请输入印章宽度", trigger: "blur" },
              {
                  min: 1,
                  max: 3,
                  message: "长度在 1 到 3 个字符",
                  trigger: "blur",
              },
            ],
            size_l:[
              { required: true, message: "请输入印章长度", trigger: "blur" },
              {
                  min: 1,
                  max: 3,
                  message: "长度在 1 到 3 个字符",
                  trigger: "blur",
              },
            ]
        },
        // 印章颜色选项数组
        colorList:[],
        // 印章类型选项数组
        typeList:[],
        uploadDialogVisible:false,
        addDialogVisible:false,
        //添加签章列表对象
        addForm:{
          name:'',
          type:'',
          size_l:'',
          size_w:'',
          color:''
        },
        addrules:{
            name:[
              { required: true, message: "请输入印章名", trigger: "blur" },
              {
                  min: 2,
                  max: 6,
                  message: "长度在 2 到 6 个字符",
                  trigger: "blur",
              },
            ],
            size_l:[
              { required: true, message: "请输入印章长度", trigger: "blur" },
              {
                  min: 1,
                  max: 3,
                  message: "长度在 1 到 3 个字符",
                  trigger: "blur",
              },
            ],
            size_w:[
              { required: true, message: "请输入印章长度", trigger: "blur" },
              {
                  min: 1,
                  max: 3,
                  message: "长度在 1 到 2 个字符",
                  trigger: "blur",
              },
            ]
        },
        // 存储上传图片的id
        id:'',
        // 添加图片显示隐藏
        imgDialogVisible:false,
        addId:''
      }
    },
    methods:{
         //表格序号
        indexMethod(index){
          return (index+1)+(this.paramsInfo.pagenum-1)*this.paramsInfo.pagesize
        },
        //获取签章列表数据
        async getSignatureInfo(){
         const {data:res}=await this.$http.get('seal/search_data/',{params:this.paramsInfo})
         if(res.code !==200) this.$message({type:'error',message:res.message})
         this.signatureList=res.data.current_page_data
         this.total=res.data.data_sum
        },
        handleSizeChange(newSize){
            this.paramsInfo.pagesize=newSize
            this.getSignatureInfo()
        },
        handleCurrentChange(newPage){
            this.paramsInfo.pagenum=newPage
            this.getSignatureInfo()
        },
        // 查询
        searchSignature(){
            this.paramsInfo.pagenum=1
            this.getSignatureInfo()
        },
        // 重置搜索框
        resetSearch(){
            this.paramsInfo.name=''
            this.paramsInfo.type=''
        },
        //展示添加印章对话框
        showAddDialog(){
            this.addDialogVisible=!this.addDialogVisible
        },
        // 添加用户
        addSignature(){
            this.$refs.addFormRef.validate(async valid=>{
                if (!valid) return
                const { data: res } = await this.$http.post("/seal/add/", this.addForm)
                if(res.code !==200) return this.$message({type:'error',message:res.message})
                this.addDialogVisible=!this.addDialogVisible
                this.imgDialogVisible=!this.imgDialogVisible
                this.addId=res.data.id
                console.log(this.addId)
            })
        },
        // 修改状态
       async signatureStateChanged(row){
           let id=row.id
           let status=row.status
           const {data:res}=await this.$http.post('seal/status_change/',{id,status})
           if(res.code !==200) return this.$message({type:'error',message:res.message})
           this.$message({type:'success',message:res.message})
        },
        //删除印章列表
       async removeSignature(id){
            const result = await this.$confirm(
                "此操作将永久删除该印章, 是否继续?",
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
            // 调接口删除印章列表
            const { data: res } = await this.$http.post("/seal/delete/",{id:id})
            // console.log(res)
            if (res.code !== 200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
            this.getSignatureInfo()
        },
        // 显示编辑印章列表对话框
        showEditDialog(row){
            this.editDialogVisible=!this.editDialogVisible
            this.editForm=row
            this.getSignatureInfo()
        },
        // 编辑印章列表
        editSignatureInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return 
                const {data:res}=await this.$http.post('/seal/change/',this.editForm)
                console.log(res)
                if(res.code!==200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.editDialogVisible=!this.editDialogVisible
                this.getSignatureInfo()
            })
        },
        // 获取印章颜色选项数组
       async getColors(){
            const {data:res}=await this.$http.get('/seal/color_name_data/')
            this.colorList=res.data
        },
        // 获取印章类型选项数组
       async getType(){
            const {data:res}=await this.$http.get('/seal/type_name_data/')
            this.typeList=res.data
        },
         // 重置编辑用户表单验证规则
        editClosed(){
            this.$refs.editFormRef.resetFields()
        },
        addClosed(){
            this.$refs.addFormRef.resetFields()
        },
        // 显示上传印章图片对话框
        showUploadDialog(id){
            this.uploadDialogVisible=!this.uploadDialogVisible
            this.id=id
        },
        // 关闭上传印章图片对话框
        closeUploadDialog(){
            this.uploadDialogVisible=false
        },
        // 关闭添加印章图片对话框
        closeImgDialog(){
            this.imgDialogVisible=false
        }
        
    },
    created(){
        this.getSignatureInfo()
        this.getColors()
        this.getType()
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
.el-image{
  width:123px;
  height:123px;
}


</style>