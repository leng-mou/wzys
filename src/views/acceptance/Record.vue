<template>
  <div class="record">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>验收管理</el-breadcrumb-item>
        <el-breadcrumb-item>验收记录</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card class="record_card">

           <!-- 搜索框 -->
          <el-form :model="paramsInfo" label-position="right" label-width="100px" >
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="任务编号">
                    <el-input v-model="paramsInfo.task_id"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item label="状态">
                    <!-- <el-input v-model="paramsInfo.status"></el-input> -->
                    <el-select v-model="paramsInfo.status"  placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.status"
                        :label="item.label"
                        :value="item.status">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label="验收时间">
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
                <el-button type="primary" icon="el-icon-search" @click="searchRecord">查询</el-button>
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
          <el-table :data="recordList" border>
            <el-table-column label="序号" align="center" type="index" :index="indexMethod">
            </el-table-column>

            <el-table-column label="任务编号" align="center" prop="task_id" width="120">
            </el-table-column>

            <el-table-column label="状态" align="center" prop="status" width="120">
            </el-table-column>

            <el-table-column label="验收时间" align="center" prop="time_to" width="180">
            </el-table-column>

            <el-table-column label="验收员" align="center" prop="creator" width="120">
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

            <el-table-column label="备注" align="center" prop="note" width="120">
            </el-table-column>

            <el-table-column label="是否验收" align="center" prop="receipt.is_checked" width="120">
            </el-table-column>

            <el-table-column label="操作"  fixed="right" align="center" width="100">
            <template v-slot="scope">
                <el-button
                  type="success"
                  icon="el-icon-more-outline"
                  size="mini"
                  @click="toDetail(scope.row.id)"
                >详情</el-button>
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
import { downloadFile } from '@/util/downloadFile.js'
export default {
  name:'Record',
  data(){
    return {
      paramsInfo:{
        task_id:'',
        status:'',
        create_time:'',
        pagenum:1,
        pagesize: 5,
      },
      recordList:[],
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
      options:[
        {label:'通过',status:'通过'},
        {label:'拒收',status:'拒收'},
        {label:'已取消',status:'已取消'},
      ]
    }
  },
  methods:{
        indexMethod(index){
          return (index+1)+(this.paramsInfo.pagenum-1)*this.paramsInfo.pagesize
        },
      // 获取验收记录列表数据
       async getRecordInfo(){
            const {data:res}=await this.$http.get('check/task_search_data/',{params:this.paramsInfo})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.recordList=res.data.current_page_data.map((item)=>{
              return {...item,time_to:dateFmt(item.time_to,"YYYY/MM/DD hh:mm:ss")}
            })
            this.total=res.data.data_sum
        },
        handleSizeChange(newSize){
            this.paramsInfo.pagesize=newSize
            this.getRecordInfo()
        },
        handleCurrentChange(newPage){
            this.paramsInfo.pagenum=newPage
            this.getRecordInfo()
        },
        searchRecord(){
            this.paramsInfo.pagenum=1
            this.getRecordInfo()
        },
        resetSearch(){
            this.paramsInfo.task_id=''
            this.paramsInfo.status=''
            this.paramsInfo.date_to=''
        },
       async exportExcel(){
            const res=await this.$http.get('check/task_excel_downlaod/',{
              params:this.paramsInfo,
              responseType: 'blob'
            })
            downloadFile(res,'验收记录.xlsx'); 
        },
        toDetail(id){
            this.$router.push(`/detail/${id}`)
        },
        
  },
  watch:{
      '$route':function(to,from){
          if(from.path.includes('/sign') && to.path=='/record'){
            this.getRecordInfo()
          }
      }
  },
  created(){
      this.getRecordInfo()
  }
}

</script>
<style scoped lang="scss">
.el-pagination{
    margin-top:15px;
}
</style>