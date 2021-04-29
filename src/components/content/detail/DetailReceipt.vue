<template>
  <div class="detail_receipt">
        <el-row :gutter="40">
            <el-col :span="8">
                <div class="order_id_erp"><span>采购订单号(ERP) :</span> {{receipt.order_id_erp}}</div>
            </el-col>
            <el-col :span="8">
                <div class="order_id_ec"><span>采购订单号(电商) :</span> {{receipt.order_id_ec}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="9">
            <div class="contr_id"><span>协议编号 :</span> {{receipt.contr_id}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="9">
                <div class="title"><span>请购单标题 :</span> {{receipt.title}}</div>    
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="8">
                <div class="buy_name"><span>采购商名称 :</span> {{receipt.buy_name}}</div>
            </el-col>
            <el-col :span="8">
                <div class="buy_cont"><span>采购商联系人 :</span> {{receipt.buy_cont}}</div>
            </el-col>
            <el-col :span="8">
                <div class="buy_tel"><span>采购商电话 :</span> {{receipt.buy_tel}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="8">
                <div class="sup_name"><span>供应商名称 :</span> {{receipt.sup_name}}</div>
            </el-col>
            <el-col :span="8">
                <div class="sup_cont"><span>供应商联系人 :</span> {{receipt.sup_cont}}</div>
            </el-col>
            <el-col :span="8">
                <div class="sup_tel"><span>供应商电话 :</span> {{receipt.sup_tel}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="8">
                <div class="tran_name"><span>承运商名称 :</span> {{receipt.tran_name}}</div>
            </el-col>
            <el-col :span="8">
                <div class="tran_cont"><span>承运商联系人 :</span> {{receipt.tran_cont}}</div>
            </el-col>
            <el-col :span="8">
                <div class="tran_tel"><span>承运商电话 :</span> {{receipt.tran_tel}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="9">
                <div class="money"><span>订单总金额 :</span> {{receipt.money}}</div>
            </el-col>
        </el-row>

        <el-row :gutter="40">
            <el-col :span="9">
                <div class="rec_loc"><span>收货地址 :</span> {{receipt.rec_loc}}</div>
            </el-col>
        </el-row>
  </div>
</template>

<script>
export default {
    props:{
        receipt:{
            type:Object,
            default(){
                return {}
            }
        }
    }
}

</script>
<style scoped lang="scss">
.detail_receipt{
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
</style>