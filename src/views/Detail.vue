<template>
  <div class="detali">
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>验收管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/record' }">验收记录</el-breadcrumb-item>
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <detail-info :detailObj="detailObj"></detail-info>

      <el-divider></el-divider>

      <detail-receipt :receipt="receipt"></detail-receipt>

      <el-divider>签字图片</el-divider>

      <div class="images_signs">
        <!-- <div v-if="isSigns">暂无图片</div>
        <viewer :images="images_signs">
            <img v-for="src in images_signs" :src="$http.defaults.baseURL+src" :key="src" width="195" height="120">
        </viewer> -->
        <detail-image :images_uploads="images_signs"></detail-image>
        
        <a :href="$http.defaults.baseURL+this.pdf" target="view_window">
            <el-button type="primary" icon="el-icon-printer">打印</el-button>
        </a>
        
      </div>

      <el-divider>上传图片</el-divider>

      <detail-image :images_uploads="images_uploads"></detail-image>

      <el-divider>视频截图</el-divider>

      <detail-image :images_others="images_others"></detail-image>

      <el-divider></el-divider>

      <div class="video_container">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <div 
          class="video-wrap" 
          v-loading="loading"
          element-loading-text="视频正在处理中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">
            <video autoplay controls :src="$http.defaults.baseURL+'/check/task_search_data_video?task_id=' + this.task_id + '&video_id='+this.value" type="rtmp/mp4"></video>
          </div>
      </div>
      
    </el-card>
  </div>
</template>

<script>
import { dateFmt } from "@/util/dateFmt.js";
import DetailImage from '@/components/content/detail/DetailImage'
import DetailInfo from '@/components/content/detail/DetailInfo'
import DetailReceipt from '@/components/content/detail/DetailReceipt'
export default {
  name:'Detail',
  components:{
    DetailImage,
    DetailInfo,
    DetailReceipt
  },
  data(){
    return {
      task_id:this.$route.params.id,
      detailObj:{},
      receipt:{},
      // 签字图片
      images_signs:[],
      // 视频截图
      images_others:[],
      // 上传图片
      images_uploads:[],
      // 打印pdf链接
      pdf:'',
      loading:false,
      options: [{
          value: '0',
          label: '1号摄像头'
        }, {
          value: '1',
          label: '2号摄像头'
        }, {
          value: '2',
          label: '3号摄像头'
        }, {
          value: '3',
          label: '4号摄像头'
        }],
      value: '0'
    }
  },
  methods:{
     async getDetailList(){
            const {data:res}=await this.$http.get('check/task_particulars/',{params:{task_id:this.$route.params.id}})
            if(res.code !==200) this.$message({type:'error',message:res.message})
           
            let temp={...res.data,time_to:dateFmt(res.data.time_to,"YYYY/MM/DD hh:mm:ss")}
            this.detailObj=temp
            this.receipt=this.detailObj.receipt_id
            // 签字图片
            this.images_signs=this.detailObj.photo_signs
            // 其他图片(视频截图)
            this.images_others=this.detailObj.photo_others.map(item=>{
              return item.img_file
            })
            // 上传图片
            this.images_uploads=this.detailObj.photo_uploads.map(item=>{
              return item.img_file
            })
      },
     async getPdfUrl(){
            const {data:res}=await this.$http.get('check/task_pdf/',{params:{task_id:this.$route.params.id}})
            if(res.code !==200) this.$message({type:'error',message:res.message})
  
            if(res.data&&res.data.length!==0){
                this.pdf=res.data[0].img_file
            }else{
                this.pdf=''
            }          
      },
      // async getVideo(){
      //       const {data:res}=await this.$http.get('check/task_search_data_video/',{params:{task_id:this.$route.params.id,video_id:this.value}})
      //       if(res.code &&res.code==500) {
      //          this.loading=true
      //       }
      //       console.log(res)    
      // }
  },
  created(){
      this.getDetailList()
      this.getPdfUrl()
      // this.getVideo()
  }
}

</script>
<style scoped lang="scss">
.detali{
  .images_signs{
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      margin:5px;
    }
  }
}

.video_container{
  position: relative;
  margin-top:50px;
}
.el-select{
  position: absolute;
}

 .video-wrap { 
  width: 680px;
  height: 390px;
  margin:0 auto;
  margin-bottom: 20px;
}

 .video-wrap video {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  outline: none;
}
</style>