<template>
  <div class="all">
    <div class="images_container">
        <div class="images" v-for="(item, index) in images" :key="index">
          <img :src="$http.defaults.baseURL+item.img_file" @click="imgClick(item,index)" :class="{ active: index === currentIndex }">
        </div>
    </div>
    
    <div class="drag" @drop="drop" @dragover.prevent id="dv" 
    :style="{backgroundImage: 'url(' +$http.defaults.baseURL+srcImgUrl + ')', backgroundSize:'100% 100%',
            height:height+ 'px',width:width+ 'px'
    }"

    >
      <img
        :src="$http.defaults.baseURL+item.url"
        alt=""
        :class="['box', item.selectName]"
        @mousedown="move($event, item,index)"
        @mouseup="overMove($event,item)"
        @click.stop="getModel(item)"
        @dblclick="remove(item,index)"
        v-for="(item, index) in dropData"
        :key="item.id"
        :style="{ left: item.left + 'px', top: item.top + 'px' }"/>
    </div>

    <div class="sig_container">
      <div class="content">
          <div class="autograph">
              <el-button @click="refresh">刷新</el-button>
              <div class="autograph_img_container">
                  <div
                  class="autograph_img"
                  draggable="true"
                  @dragstart="dragstart($event, item)"
                  @dragend="dragend"
                  v-for="(item, index) in signPic"
                  :key="index">
                      <img :src="$http.defaults.baseURL+item.url"/>
                  </div>
              </div>
          </div>
          <div class="seal">
              <el-form :model="paramsInfo" label-width="80px">
                  <el-form-item label="主体类型">
                    <el-select v-model="paramsInfo.type"  placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.type"
                        :label="item.label"
                        :value="item.type">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-form>
              <div class="seal_container">
                  <div
                  class="signature"
                  draggable="true"
                  @dragstart="dragstart($event, item)"
                  @dragend="dragend"
                  v-for="(item, index) in dragList"
                  :key="index">
                  <img :src="$http.defaults.baseURL+item.url"/>
                  </div>
              </div>
          </div>
      </div>

      <div class="btns">
          <el-button type="success" @click="sign">签名</el-button>
          <el-button type="danger" @click="submit">提交本页</el-button>
          <el-button type="warning" @click="endCheck">结束验收</el-button>
      </div>
    </div>
    <!-- 扫描对话框 -->
    <el-dialog title="预览图片" :visible.sync="previewDialogVisible" :close-on-click-modal="false" width="32%">
      <!-- 图片区域 --> 
      <div class="tips" :class="[{'green':pass},{'red':warn}]">{{this.tips}}</div>
      <div class="pre_images" @click.stop="" v-viewer>
        <div class="pre_images-item" v-for="(item,index) in preImages"  :key="index">
            <el-image :src="$http.defaults.baseURL+item.img_file" fit="cover"  style="width: 100px; height: 100px">
            </el-image>
            <!-- <div class="delete_icon" @click="removePic(item.id)"><i class="el-icon-delete"></i></div> -->
        </div>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible=false">关 闭</el-button>
        <el-button @click="sureEnd" type="danger">确认结束</el-button>
      </span>
    </el-dialog>

    <!-- 免责声明弹窗 -->
    <el-dialog title="免责声明" :visible.sync="declareDialogVisible" :close-on-click-modal="false" width="35%">
      <!-- 内容区域 --> 
      <p>根据《中华人民共和国电子签名法》《国务院关于国家行政机关和企业事业单位社会团体印章管理的规定》（国发〔1999〕25号）以及其他法律法规规定，我们特此提示您：</p>
      <h4>（1）本系统的电子签章相关功能仅被设计和允许用于国网江苏省电力公司南京供电公司的电商物资到货验收业务场景中，禁止用于任何其他用途。在本系统内关于电子签章的所有操作所产生的业务和法律责任均由实际操作人承担。</h4>
      <h4>（2）电子公章的图形化特征，应当与实物印章的印模完全一致。因此，在录入签章时，请您按以上原则保证签章数据的真实性。</h4>
      <h4>（3）电子公章的使用审批流程应当与实物印章的使用审批流程一致；加盖电子签章的协议、凭据、流转单等各类电子文档，与加盖实物印章的纸质书面材料具有同等法律效力。因此，在您使用本系统内的电子签章之前，您需要确定您的操作已经征得相关单位和个人的同意并符合相关业务流程。</h4>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDeclure" type="danger">拒绝</el-button>
        <el-button @click="agreeDeclare" type="success">同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Sign',
  data() {
    return {
      task_id: this.$route.params.id,
      positionX: 0,
      positionY: 0,
      dropData: [],
      currentLeft: 50,
      currentTop: 50,
      dragList: [],
      images:[],
      // 背景图链接
      srcImgUrl:'',
      currentName: '',
      // 印章参数对象
      paramsInfo:{
        type:'项目单位',
        pagenum:1,
        pagesize:3,
      },
      // 下拉框参数
      options:[
        {label:'项目单位',type:'项目单位'},
        {label:'物资部门',type:'物资部门'},
        {label:'供应商',type:'供应商'},
      ],
      leftrate:[],
      toprate:[],
      height:500,
      width:568,
      // 单据图片id
      docimage_id:'',
      seal_id:[],
      // 印章相对位置参数对象
      locs:{},
      // 单据图片默认高亮
      currentIndex:0,
      // 预览弹框
      previewDialogVisible:false,
      // 预览图片
      preImages:[],
      srcList:[],
      //签字图片
      signPic:[],
      temporaryX:null,
      temporaryY:null,
      // 签字盖章提醒
      tips:'',
      warn:false,
      pass:false,
      bool:false,
      // 免责声明
      declareDialogVisible:false
    }
  },
  computed: {
    
  },
  methods: {
   async imgClick(item,index){
            if(index!==this.currentIndex){
                const result = await this.$confirm(
                "请确定本页签字、盖章是否提交,切页不保留签字、盖章?",
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
            }
            
            this.currentIndex=index
            this.srcImgUrl=item.img_file
            this.height=(this.images[index].height/this.images[index].width)*568
            this.docimage_id=this.images[index].id
            // 切页清除印章
            this.dropData.splice(0,this.dropData.length)
            this.locs={}
    },
    // 获取图片数据
    async getImages(){
            const {data:res}=await this.$http.get('check/end_pass_receipt_docimage_search/',{params:{id:this.task_id}})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.images=res.data
            // 默认展示第一张背景图
            if(this.images){
              this.srcImgUrl=this.images[0].img_file
              this.height=(this.images[0].height/this.images[0].width)*568
              this.docimage_id=this.images[0].id
            }
    },
    //获取签章列表数据
    async getSignatureInfo(){
            const {data:res}=await this.$http.get('check/end_pass_seal_search/',{params:this.paramsInfo})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.dragList=res.data.current_page_data.map(item=>{
              return {...item,url:item.image}
            })
    },
    async submit(){
            const result = await this.$confirm(
            "是否确认提交?",
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
            // 签章或签名为空不能提交
            // if(JSON.stringify(this.locs) == '{}') return this.$message.error('请选择印章和签名')
            const {data:res}=await this.$http.post('check/end_pass_sign_seal/',{seal_id:this.seal_id,docimage_id:this.docimage_id,task_id:this.task_id,locs:this.locs})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
    },
    // 结束验收
    async endCheck(){
            this.preview()
    },
    // 确认结束验收
    async sureEnd(){
             const result = await this.$confirm(
            "是否确认结束验收?",
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
            // 调接口结束验收
            const {data:res}=await this.$http.post('check/end_pass_affirm/',{task_id:this.task_id})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.$message({type:'success',message:res.message})
            this.$router.push('/record')
            this.previewDialogVisible=!this.previewDialogVisible
    },
    async removePic(id){
          const result = await this.$confirm(
          "是否确认删除?",
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
          // 调接口删除图片
          const {data:res}=await this.$http.post('check/end_pass_delete_photo/',{photo_id:id})
          if(res.code !==200) this.$message({type:'error',message:res.message})
          this.$message({type:'success',message:res.message})
          this.preview()
          this.previewDialogVisible=!this.previewDialogVisible
   },
    // 获取预览图片 
    async preview(){
            this.previewDialogVisible=!this.previewDialogVisible
            const {data:res}=await this.$http.get('check/end_pass_show_sign_photo/',{params:{task_id:this.task_id}})
            if(res.code !==200) this.$message({type:'error',message:res.message})
            this.preImages=res.data
            this.tips=res.message
            this.bool=res.bool
            
            if(this.bool=='true'){
               this.warn=false
               this.pass=true
            }else{
               this.warn=true
               this.pass=false
            }
    },
    // 获取签字图片
    async getSignPic(){
        const {data:res}=await this.$http.get('check/end_pass_show_sign_img/',{params:{task_id:this.task_id}})
        if(res.code !==200) this.$message({type:'error',message:res.message})
        this.signPic=res.data
    },
    // 局部刷新
    async refresh(){
        const {data:res}=await this.$http.get('check/end_pass_show_sign_img/',{params:{task_id:this.task_id}})
        if(res.code !==200) this.$message({type:'error',message:res.message})
        this.signPic=res.data
    },
    // 调用签名板
   async sign(){
        var url = this.$http.defaults.baseURL+'/check/hwsign?id='+this.task_id;
    		window.location.href = "openIE:" + url;
    },
    refuseDeclure(){
        this.declareDialogVisible=!this.declareDialogVisible
        this.$router.push('/execute')
    },
    agreeDeclare(){
        this.declareDialogVisible=!this.declareDialogVisible
    },
    move(e, item,index) {
      const odiv = e.target
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => {
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 设置边距
        if (top <= 0) {
          top = 0
        }
        if (top >= this.height - 100) {
          top = this.height - 100
        }
        if (left >= 568 - 100) {
          left = 568 - 100
        }
        if (left <= 0) {
          left = 0
        }
        item.left = left
        item.top = top
        // this.leftrate=item.left/568
        // this.toprate=item.top/this.height
        // this.le=item.left/568
        // this.to=item.top/this.height
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    overMove(e,item){
        // this.leftrate.push({left:item.left/568,id:item.id})
        // this.toprate.push({top:item.left/this.height,id:item.id})
        let loc = [item.left / 568, item.top / this.height];
        this.locs[item.id] = loc;
    },
    // 移除印章
    remove(item,index){
      this.dropData.splice(index,1)
      // this.seal_id.splice(index,1)
      delete this.locs[item.id]
    },
    dragstart(e, item) {
      // 将拖拽对象的参数传递给拖拽存放地
      this.temporaryX=e.offsetX
      this.temporaryY=e.offsetY
      e.dataTransfer.setData('item', JSON.stringify(item))
      // this.seal_id.push(item.id)
    },
    dragend(e) {
      // 清除
      e.dataTransfer.clearData()
    },
    drop(e) {
      // 获取拖拽对象的参数
      let data = e.dataTransfer.getData('item')
      data = JSON.parse(data)
      // 鼠标落点位置相对于当前拖拽存放地的 x y
      // data.left = e.layerX-40
      // data.top = e.layerY-40
      data.left = e.offsetX-this.temporaryX
      data.top = e.offsetY-this.temporaryY

      // 解决两次拖拽不能放在tongyi位置的bug
      // if(e.target.className=='box'){
      //    data.left=e.offsetX+e.target.offsetLeft-25
      //    data.top=e.offsetY+e.target.offsetTop-25
      // } 
      if(e.target.className!=='drag'){
        //如果事件对象是之前的图片
        data.left = e.offsetX+e.target.offsetLeft-this.temporaryX
        data.top = e.offsetY+e.target.offsetTop-this.temporaryY
      }

      let loc = [data.left / 568, data.top / this.height];
      this.locs[data.id] = loc;
      // 存放到当前拖拽对象生成的列表中
      this.dropData.push(data)
    },
    getModel(item) {
      this.dropData = this.dropData.map((item) => {
        item.selectName = ''
        return item
      })
      item.selectName = 'select'
    }, 
  },
  watch:{
      paramsInfo:{
        handler:function(n,o){
          this.paramsInfo.type=n.type
          this.getSignatureInfo()
        },
        immediate: true,
        deep:true
      },
      '$route':{
        handler:function(to,from){
            if(to.path.includes('/sign')){
              this.declareDialogVisible=!this.declareDialogVisible
            }
        },
        immediate: true,
      }
  },
  created(){
    this.getImages()
    this.getSignatureInfo()
    this.getSignPic()
  }
}
</script>

<style lang="scss" scoped>
.all {
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .images_container{
      width: 150px;
      height: 350px;
      .images{
          margin-top:20px;
          width: 150px;
          height: 150px;
          img{
            width: 150px;
            height: 150px;
          }
      }
      .active{
          box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.2);
      }
  }
  .drag{
      background-image: url('');
      background-size:contain;
      margin: 100px auto;
      position: relative;
      top:100px;
      .box{
          position: absolute;
          top: 0px;
          left: 0px;
          object-fit: contain;
          width: 100px;
          height: 100px;
          user-select: none;
          cursor: pointer;
          -webkit-user-drag: none;
      }
  }
  .sig_container{
     height: 350px;
      text-align: center;
      .content{
        display: flex;
        .autograph{
            border:1px solid #ccc;
            .el-button{
                 margin-top:10px;
            }
            .autograph_img_container{
                    height: 240px;
                    overflow: auto;
                    margin-top:20px;
                    .autograph_img{
                    display: flex;
                    margin:8px auto 0;
                    width: 100px;
                    height: 100px;
                    img{
                        object-fit: contain;
                        vertical-align: middle;
                        text-align: center;
                        width: 100px;
                        height: 100px;
                        -webkit-user-drag: none;
                        position: relative;
                        z-index: 5;
                    }
                }
            }
        }
        .seal{
            border: 1px solid #ccc;
            margin-left:10px;
            width: 230px;
            .el-form{
                margin-top:10px;
            }
            .seal_container{
                height: 240px;
                overflow: auto;
                display: flex;
                justify-content: space-evenly;
                flex-wrap: wrap;
            }
            .signature{
                width: 100px;
                height: 100px;
                margin:8px 0;
                img{
                    object-fit: contain;
                    vertical-align: middle;
                    text-align: center;
                    width: 100px;
                    height: 100px;
                    -webkit-user-drag: none;
                    position: relative;
                    z-index: 5;
                }
            }
        }
      }
      .btns{
          .el-button{
              margin-top:20px;
            }
      }
  }
  .tips{
    text-align: center;
    font-size: 18px;
  }
  .red{
    color: red;
  }
  .green{
    color: rgb(103, 194, 58);
  }
  .pre_images{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top:25px;
      .pre_images-item{
         margin:5px;
      }
      .delete_icon{
        font-size: 25px;
        cursor: pointer;
        text-align: center;
        color: red;
            .el-icon-delete{
              padding-top:10px;
            }
      }
  }
}

</style>
