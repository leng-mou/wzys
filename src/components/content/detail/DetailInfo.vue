<template>
  <div class="detail_info">
       <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"><span>任务编号: </span>{{detailObj.task_id}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"><span>状态: </span>{{detailObj.status}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"><span>验收时间: </span>{{detailObj.time_to}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"><span>验收员: </span>{{detailObj.creator}}</div>
          </el-col>
        </el-row>
  </div>
</template>

<script>
export default {
    props:{
        detailObj:{
            type:Object,
            default(){
                return {}
            }
        }
    }
}

</script>
<style scoped lang="scss">
.detail_info{
    span{
      font-weight: 700;
    }
  }
</style>