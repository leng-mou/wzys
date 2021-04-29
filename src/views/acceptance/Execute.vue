<template>
  <div class="execute">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>验收管理</el-breadcrumb-item>
        <el-breadcrumb-item>验收执行</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card class="execute_card">
          <!-- 搜索框 -->
          <el-form :model="paramsInfo" label-position="right" label-width="100px" >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="任务编号">
                    <el-input v-model="paramsInfo.task_id"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="请购单标题">
                    <el-input v-model="paramsInfo.receipt__title"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="2.5">
                <el-button type="primary" icon="el-icon-search" @click="searchReceiptTask">查询</el-button>
              </el-col>

              <el-col :span="2.5">
                <el-button type="info" icon="el-icon-refresh-right" @click="resetReceiptTask">重置</el-button>
              </el-col>

              <el-col :span="2.5">
                <el-button type="danger" icon="el-icon-document-add" @click="showAddTask">创建验收任务</el-button>
              </el-col>
            </el-row>
          </el-form>

          <!-- 表格 -->
          <el-table :data="receiptList" border>
            <el-table-column label="序号" align="center" type="index" :index="indexMethod">
            </el-table-column>

            <el-table-column label="任务编号" align="center" prop="task_id" width="120">
            </el-table-column>

            <el-table-column label="状态" align="center" prop="status">
            </el-table-column>

            <el-table-column label="创建人(工号/姓名)" align="center" prop="creator" width="140">
            </el-table-column>

            <el-table-column label="采购订单ERP" align="center" prop="receipt.order_id_erp" width="120">
            </el-table-column>

            <el-table-column label="采购订单电商" align="center" prop="receipt.order_id_ec" width="180">
            </el-table-column>

            <el-table-column label="协议编号" align="center" prop="receipt.contr_id" width="200">
            </el-table-column>

            <el-table-column label="请购单标题" align="center" prop="receipt.title" width="120">
            </el-table-column>
            
            <el-table-column label="采购商名称" align="center" prop="receipt.buy_name" width="180">
            </el-table-column>

            <el-table-column label="采购商联系人" align="center" prop="receipt.buy_cont" width="120">
            </el-table-column>

            <el-table-column label="采购商电话" align="center" prop="receipt.buy_tel" width="130">
            </el-table-column>

            <el-table-column label="供应商名称" align="center" prop="receipt.sup_name" width="180">
            </el-table-column>

            <el-table-column label="供应商联系人" align="center" prop="receipt.sup_cont" width="120">
            </el-table-column>

            <el-table-column label="供应商电话" align="center" prop="receipt.sup_tel" width="130">
            </el-table-column>

            <el-table-column label="承运商名称" align="center" prop="receipt.tran_name" width="180">
            </el-table-column>

            <el-table-column label="承运商联系人" align="center" prop="receipt.tran_cont" width="120">
            </el-table-column>

            <el-table-column label="承运商电话" align="center" prop="receipt.tran_tel" width="130">
            </el-table-column>

            <el-table-column label="总金额" align="center" prop="receipt.money" width="100">
            </el-table-column>

            <el-table-column label="收货地址" align="center" prop="receipt.rec_loc" width="180">
            </el-table-column>

            <el-table-column label="操作"  fixed="right" align="center" width="350">
            <template v-slot="scope">
            
                <el-button
                  ref="start"
                  type="primary"
                  icon="el-icon-video-pause"
                  size="mini"
                  :disabled="scope.row.status =='进行中...'?true:false"
                  @click="startReceipt(scope.row)"
                >开始</el-button>
          
                <el-button
                  type="warning"
                  icon="el-icon-video-play"
                  size="mini"
                  :disabled="scope.row.status =='未开始'?true:false"
                  @click="showEndReceipt(scope.row.id)"
                >结束</el-button>
        
                <el-button
                  type="success"
                  icon="el-icon-more-outline"
                  size="mini"
                  @click="toDetail(scope.row.id)"
                >详情</el-button>

                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeReceiptTask(scope.row.id)"
                >删除</el-button>
              
            </template>
            </el-table-column>   
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paramsInfo.pagenum"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="paramsInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>

          <!-- 创建验收任务对话框 -->
          <el-dialog title="创建验收任务" :visible.sync="addTaskDialogVisible" :close-on-click-modal="false" width="80%" @close="createClosed">
            <!-- 内容主体区域 -->
            <el-card class="addTask_card">
              <!-- 搜索框 -->
              <el-form :model="createInfo" label-position="right" label-width="100px" >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="采购订单ERP">
                        <el-input v-model="createInfo.order_id_erp"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="2.5">
                    <el-button type="primary" icon="el-icon-search" @click="searchCreate">查询</el-button>
                  </el-col>

                  <el-col :span="2.5">
                    <el-button type="info" icon="el-icon-refresh-right" @click="resetCreateSearch">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>

              <!-- 表格 -->
              <el-table :data="createReceiptList" border>
                  <el-table-column label="序号" align="center" type="index" :index="indexMethod">
                  </el-table-column>

                  <el-table-column label="采购订单ERP" align="center" prop="order_id_erp" width="120">
                  </el-table-column>

                  <el-table-column label="录入时间" align="center" prop="create_time" width="150">
                  </el-table-column>

                  <el-table-column label="是否验收" align="center" prop="is_checked" width="120">
                  </el-table-column>

                  <el-table-column label="采购订单电商" align="center" prop="order_id_ec" width="180">
                  </el-table-column>

                  <el-table-column label="协议编号" align="center" prop="contr_id" width="200">
                  </el-table-column>

                  <el-table-column label="请购单标题" align="center" prop="title" width="180">
                  </el-table-column>

                  <el-table-column label="采购商名称" align="center" prop="buy_name" width="180">
                  </el-table-column>

                  <el-table-column label="采购商联系人" align="center" prop="buy_cont" width="120">
                  </el-table-column>

                  <el-table-column label="采购商电话" align="center" prop="buy_tel" width="130">
                  </el-table-column>

                  <el-table-column label="供应商名称" align="center" prop="sup_name" width="180">
                  </el-table-column>

                  <el-table-column label="供应商联系人" align="center" prop="sup_cont" width="120">
                  </el-table-column>

                  <el-table-column label="供应商电话" align="center" prop="sup_tel" width="130">
                  </el-table-column>

                  <el-table-column label="承运商名称" align="center" prop="tran_name" width="180">
                  </el-table-column>

                  <el-table-column label="承运商联系人" align="center" prop="tran_cont" width="120">
                  </el-table-column>

                  <el-table-column label="承运商电话" align="center" prop="tran_tel" width="130">
                  </el-table-column>

                  <el-table-column label="总金额" align="center" prop="money" width="100">
                  </el-table-column>

                  <el-table-column label="收货地址" align="center" prop="rec_loc" width="180">
                  </el-table-column>

                  <el-table-column label="操作" fixed="right" align="center" width="80">
                  <template v-slot="scope">
                    <el-tooltip effect="dark" content="创建任务" placement="top" :enterable="false">
                      <el-button
                        type="primary"
                        icon="el-icon-document-add"
                        size="mini"
                        @click="addCreate(scope.row.id)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
                <el-pagination
                  @size-change="createSizeChange"
                  @current-change="createCurrentChange"
                  :current-page="createInfo.pagenum"
                  :page-sizes="[1, 3, 5, 10]"
                  :page-size="createInfo.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="createTotal"
                ></el-pagination>
            </el-card>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addTaskDialogVisible = false">关  闭</el-button>
            </span>
          </el-dialog>

          <!-- 详情对话框 -->
          <el-dialog title="验收任务详情" :visible.sync="detailDialogVisible" :close-on-click-modal="false" width="80%">
            <!-- 内容主体区域 -->
            <div class="execute_info">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple"><span>任务编号: </span>{{detailObj.task_id}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple"><span>状态: </span>{{detailObj.status}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple"><span>创建人: </span>{{detailObj.creator}}</div>
                </el-col>
              </el-row>
            </div>

            <el-divider></el-divider>

            <div class="execute_detal">
              <el-row :gutter="40">
                  <el-col :span="8">
                      <div class="order_id_erp"><span>采购订单号(ERP) :</span> {{executeDetail.order_id_erp}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="order_id_ec"><span>采购订单号(电商) :</span> {{executeDetail.order_id_ec}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="9">
                    <div class="contr_id"><span>协议编号 :</span> {{executeDetail.contr_id}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="9">
                      <div class="title"><span>请购单标题 :</span> {{executeDetail.title}}</div>    
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="8">
                      <div class="buy_name"><span>采购商名称 :</span> {{executeDetail.buy_name}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="buy_cont"><span>采购商联系人 :</span> {{executeDetail.buy_cont}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="buy_tel"><span>采购商电话 :</span> {{executeDetail.buy_tel}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="8">
                      <div class="sup_name"><span>供应商名称 :</span> {{executeDetail.sup_name}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="sup_cont"><span>供应商联系人 :</span> {{executeDetail.sup_cont}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="sup_tel"><span>供应商电话 :</span> {{executeDetail.sup_tel}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="8">
                      <div class="tran_name"><span>承运商名称 :</span> {{executeDetail.tran_name}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="tran_cont"><span>承运商联系人 :</span> {{executeDetail.tran_cont}}</div>
                  </el-col>
                  <el-col :span="8">
                      <div class="tran_tel"><span>承运商电话 :</span> {{executeDetail.tran_tel}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="9">
                      <div class="money"><span>订单总金额 :</span> {{executeDetail.money}}</div>
                  </el-col>
              </el-row>

              <el-row :gutter="40">
                  <el-col :span="9">
                      <div class="rec_loc"><span>收货地址 :</span> {{executeDetail.rec_loc}}</div>
                  </el-col>
              </el-row>
            </div>  
              
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="detailDialogVisible = false">关  闭</el-button>
            </span>
          </el-dialog>

          <!-- 结束验收对话框 -->
          <el-dialog title="结束验收处理" :visible.sync="endReceiptDialogVisible" :close-on-click-modal="false" width="23%">
            <!-- 内容主体区域 -->
              <el-row :gutter="20">
                  <el-col :span="2.5">
                    <el-button type="primary" icon="el-icon-search" @click="toCancelTask">取消</el-button>
                  </el-col>

                  <el-col :span="2.5">
                    <el-button type="success" icon="el-icon-refresh-right" @click="toPassTask">通过</el-button>
                  </el-col>

                  <el-col :span="2.5">
                    <el-button type="danger" icon="el-icon-document-add" @click="toRefuseTask">拒收</el-button>
                  </el-col>
              </el-row>
              
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="endReceiptDialogVisible = false">关  闭</el-button>
            </span>
          </el-dialog>
      </el-card>
  </div>
</template>

<script>
export default {
    name:'Execute',
    data(){
        return {
            // 验收任务数据参数对象
            paramsInfo:{
              task_id:'',
              receipt__title:'',
              pagenum:1,
              pagesize: 5,
            },
            // 创建验收任务参数对象
            createInfo:{
              order_id_erp:'',
              pagenum:1,
              pagesize: 3,
            },
            // 验收单数据
            receiptList:[],
             total:0,
            // 创建验收单数据
            createReceiptList:[],
            createTotal:0,
            addTaskDialogVisible:false,
            detailDialogVisible:false,
            detailObj:{},
            executeDetail:{},
            endReceiptDialogVisible:false,
            // 任务id
            id:''
        }
    },
    watch:{
        '$route':function(to,from){
          if(from.path.includes('/cancelTask')||from.path.includes('/refuseTask') && to.path=='/execute'){
            this.getReceiptInfo()
          }
          if(from.path=='/input'&&to.path=='/execute'){
            this.getReceiptInfo()
          }
       }
    },
    methods:{
        indexMethod(index){
          return (index+1)+(this.paramsInfo.pagenum-1)*this.paramsInfo.pagesize
        },
        // 获取验收任务列表数据
       async getReceiptInfo(){
            const {data:res}=await this.$http.get('check/search_data/',{params:this.paramsInfo})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.receiptList=res.data.current_page_data
            this.total=res.data.data_sum
        },
        handleSizeChange(newSize){
            this.paramsInfo.pagesize=newSize
            this.getReceiptInfo()
        },
        handleCurrentChange(newPage){
             this.paramsInfo.pagenum=newPage
             this.getReceiptInfo()
        },
        // 查询验收任务
        searchReceiptTask(){
            this.paramsInfo.pagenum=1
            this.getReceiptInfo()
        },
        resetReceiptTask(){
            this.paramsInfo.task_id=''
            this.paramsInfo.receipt__title=''
        },
        // 开始验收
       async startReceipt(row){
              const result = await this.$confirm(
                "是否开始验收?",
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

                // 调接口，执行验收任务
                let task_id=row.id
                const { data: res } = await this.$http.post("/check/starts/",{task_id:task_id})
                if (res.code !== 200) return this.$message({type:'error',message:res.message})
                this.$message({type:'success',message:res.message})
                this.getReceiptInfo()
                this.$refs.start.disabled=true
                
                
        },
        showEndReceipt(id){
              this.id=id
              this.endReceiptDialogVisible=!this.endReceiptDialogVisible
        },
        toPassTask(){
              this.$router.push(`/passTask/${this.id}`)
              this.endReceiptDialogVisible=!this.endReceiptDialogVisible
        },
        toCancelTask(){
              this.$router.push(`/cancelTask/${this.id}`)
              this.endReceiptDialogVisible=!this.endReceiptDialogVisible
        },
        toRefuseTask(){
              this.$router.push(`/refuseTask/${this.id}`)
              this.endReceiptDialogVisible=!this.endReceiptDialogVisible
        },
        // 删除验收任务
       async removeReceiptTask(id){
             const result = await this.$confirm(
                "此操作将永久删除该验收任务, 是否继续?",
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
            // 调接口删除验收任务
            const { data: res } = await this.$http.post("/check/delete/",{id:id})
            if (res.code !== 200) return this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
            this.getReceiptInfo()
        },
        // 验收单详情
       async toDetail(task_id){
            this.detailDialogVisible=!this.detailDialogVisible
            const {data:res}=await this.$http.get('check/search_data_rec/',{params:{task_id:task_id}})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.detailObj=res.data
            this.executeDetail=this.detailObj.receipt_id
        },
        // 获取创建验收任务数据列表
       async getCreateReceipt(){
            const {data:res}=await this.$http.get('check/search_data_rec_make/',{params:this.createInfo})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.createReceiptList=res.data.current_page_data
            this.createTotal=res.data.data_sum
        },
        createSizeChange(newSize){
            this.createInfo.pagesize=newSize
            this.getCreateReceipt()
        },
        createCurrentChange(newPage){
            this.createInfo.pagenum=newPage
            this.getCreateReceipt()
        },
        searchCreate(){
            this.createInfo.pagenum=1
            this.getCreateReceipt()
        },
        createClosed(){
            // Object.assign(this.$data, this.$options.data())
        },
        // 添加验收任务
       async addCreate(id){
                const result = await this.$confirm(
                "是否创建该验收任务?",
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
                    return this.$message.info("已取消创建")
                }
                // 调接口创建验收任务
                const token=window.sessionStorage.getItem('token')
                const { data: res } = await this.$http.post("/check/add/",{id:id,token:token})
                if(res.code !==200) return this.$message({type:'error',message:res.message}) 
                this.$message({type:'success',message:res.message})
                this.addTaskDialogVisible=!this.addTaskDialogVisible
                this.getReceiptInfo()  
        },
        resetCreateSearch(){
              this.createInfo.order_id_erp=''
        },
        showAddTask(){
             this.addTaskDialogVisible=!this.addTaskDialogVisible
        }
    },
    created(){
        this.getReceiptInfo()
        // this.getCreateReceipt()
    }
}

</script>
<style scoped lang="scss">
  .execute{
    .execute_card{
        .el-pagination{
            margin-top:15px;
        }
        .addTask_card{
              .el-pagination{
              margin-top:15px;
            }
        }
        .execute_info{
            span{
              font-weight: 700;
            }
        }
        .execute_detal{
            span{
              font-weight: 700;
            }
            .el-row:nth-child(2){
                margin:2%;
            }
            .el-row:nth-child(3){
                margin:2%;
            }
            .el-row:nth-child(4){
                margin:2%;
            }
            .el-row:nth-child(5){
                margin:2%;
            }
            .el-row:nth-child(6){
                margin:2%;
            }
            .el-row:nth-child(7){
                margin:2%;
            }
        }
    }
  }

</style>