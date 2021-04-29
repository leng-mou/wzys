<template>
  <div class="search">
     <!-- 面包屑导航区域 -->
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>单据查询</el-breadcrumb-item> 
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card class="search_card">
        <!-- 搜索框 -->
        <el-form :model="paramsInfo" label-position="right" label-width="100px" >
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="采购订单ERP">
                  <el-input v-model="paramsInfo.order_id_erp"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="供应商名称">
                  <el-input v-model="paramsInfo.sup_name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="录入时间">
                  <el-date-picker
                    v-model="paramsInfo.create_time"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="width: 100%;">
                  </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="2.5">
              <el-button type="primary" icon="el-icon-search" @click="searchBill">查询</el-button>
            </el-col>

            <el-col :span="2.5">
              <el-button type="info" icon="el-icon-refresh-right" @click="resetSearch">重置</el-button>
            </el-col>

            <el-col :span="2.5">
              <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
            </el-col>
          </el-row>

          <!-- <el-row :gutter="25">
            <el-col :span="2.5" :offset="21">
              <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
            </el-col>
          </el-row> -->
        </el-form>
        <!-- 表格 -->
        <el-table :data="billList" border>
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
            <el-tooltip effect="dark" content="删除单据" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeBill(scope.row.id)"
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
          :page-sizes="[1, 3, 5, 10]"
          :page-size="paramsInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
  </div>
</template>

<script>
import { dateFmt } from "@/util/dateFmt.js";
import { downloadFile } from '@/util/downloadFile.js';
export default {
    name:'Search',
    data(){
      return {
        // 单据列表参数对象
        paramsInfo:{
          order_id_erp:'',
          sup_name:'',
          creat_time:'',
          pagenum:1,
          pagesize: 5,
        },
        billList:[],
        total:0,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods:{
        // 表格序号
        indexMethod(index){
          return (index+1)+(this.paramsInfo.pagenum-1)*this.paramsInfo.pagesize
        },
        // 获取单据数据
       async getBillInfo(){
            const {data:res}=await this.$http.get('receipt/search_data/',{params:this.paramsInfo})
            if (res.code !== 200) return this.$message({
              type:'error',
              message:res.message
            })
            this.billList=res.data.current_page_data.map((item)=>{
              return {...item,create_time:dateFmt(item.create_time,"YYYY/MM/DD")}
            })
            this.total=res.data.data_sum
        },
        handleSizeChange(newSize){
            this.paramsInfo.pagesize=newSize
            this.getBillInfo()
        },
        handleCurrentChange(newPage){
             this.paramsInfo.pagenum=newPage
             this.getBillInfo()
        },
        resetSearch(){
            this.paramsInfo.order_id_erp=''
            this.paramsInfo.sup_name=''
            this.paramsInfo.create_time=''
        },
       async exportExcel(){
            const res=await this.$http.get('receipt/excel_download/',{
              params:this.paramsInfo,
              responseType: 'blob'
            })
            downloadFile(res,'单据列表.xlsx');
        },
        // 查询
        searchBill(){
            this.paramsInfo.pagenum=1
            this.getBillInfo()
        },
        // 删除单据
       async removeBill(id){
            const result = await this.$confirm(
                "此操作将永久删除该单据, 是否继续?",
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

            // 调接口删除
            const token=window.sessionStorage.getItem('token')
            const { data: res } = await this.$http.post("/receipt/delete/",{id:id,token:token})
            if (res.code !== 200) return this.$message({
              type:'error',
              message:res.message
            })
            this.$message({
              type:'success',
              message:res.message
            })
            this.getBillInfo()
        }
    },
    created(){
        this.getBillInfo()
    }
}

</script>
<style scoped lang="scss">
.el-pagination{
    margin-top:15px;
}
</style>