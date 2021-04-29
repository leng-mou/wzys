<template>
  <div class="home">
     <el-container class="home_content">
        <el-aside :width="isCollapse?'64px':'200px'">
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409eff"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
            :default-openeds="openeds"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.icon_id+''" v-for="item in menuList" :key="item.icon_id">
              <template slot="title">
                <i :class="iconObj[item.icon_id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+submenu.path"
                v-for="submenu in item.children"
                :key="submenu.id"
                @click="saveNavState('/'+submenu.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{submenu.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <div @click="toggle" class="toggle">
                    <span class="icon icon-shouqi"></span>
                </div>
                <!-- 头像 -->
                <div class="right">
                    <span>{{user}}</span>
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper">
                            <el-avatar :src="$http.defaults.baseURL+icon"></el-avatar>
                            <i class="el-icon-caret-bottom" />
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="showEditDialog">
                                修改密码
                            </el-dropdown-item>
                            
                            <el-dropdown-item  @click.native="showAvatarDialog">
                                更换头像
                            </el-dropdown-item>

                            <el-dropdown-item  @click.native="logout">
                                退出登录
                            </el-dropdown-item>
                            
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <transition mode="out-in">
                    <keep-alive exclude="PassTask,CancelTask,RefuseTask,Detail,Sign,Setting">
                        <router-view></router-view>
                    </keep-alive>
                </transition> 
            </el-main>
            <!-- 修改密码对话框 -->
            <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" @close="editClosed">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editrules" ref="editFormRef" label-width="100px">
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="editForm.password" placeholder="6-10个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password_repeat">
                        <el-input v-model="editForm.password_repeat" placeholder="6-10个字符"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPassword">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 更换头像对话框 -->
            <el-dialog title="上传头像" :visible.sync="avatarDialogVisible" width="30%">
                <el-form :model="form">
                    <el-form-item label-width="80px" ref="uploadElement">
                        <el-upload 
                        ref="upload"
                        action="#"
                        accept="image/png,image/gif,image/jpg,image/jpeg"
                        list-type="picture-card"
                        :limit=limitNum
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        :before-upload="handleBeforeUpload"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-change="imgChange"
                        :class="{hide:hideUpload}">
                        <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="imgdialogVisible">
                           <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                <el-row :gutter="20">
                    <el-form-item class="avatarDialogBtns">
                        <el-col :span="2.5">
                          <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
                        </el-col>

                        <el-col :span="2.5">
                          <el-button size="small"  @click="tocancel">取消上传</el-button>
                        </el-col>
                    </el-form-item>
                </el-row>
                </el-form>
            </el-dialog>
        </el-container>
     </el-container>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    name:'Home',
    data(){
        return{
            // 被激活的链接地址
            activePath: "",
            isCollapse: false,
            iconObj: {
                125: "icon iconfont icon-weibiaoti--",
                103: "icon iconfont icon-dianziqianzhang",
                101: "icon iconfont icon--_shujutongji",
                102: "icon iconfont icon-shezhi",
            },
            // 默认展开所有菜单
            openeds:[],
            // 修改密码表单信息
            editForm:{
                password:'',
                password_repeat:''
            },
            dialogVisible:false,
            // 修改密码表单验证规则
            editrules:{
                password:[
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 10,
                        message: "长度在 6 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                password_repeat:[
                    { required: true, message: "请重新输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 10,
                        message: "长度在 6 到 10 个字符",
                        trigger: "blur",
                    },
                ]
            },
            // 头像
            hideUpload: false,
            dialogImageUrl: '',
            imgdialogVisible: false,//图片预览弹窗
            limitNum:1,
            form: {},
            avatarDialogVisible: false,
        }
    },
    methods:{
       ...mapMutations(['setIcon']),
       async logout(){
            const {data:res}=await this.$http.get('/user/logout/')
            if(res.code !==200) return this.$message.error('退出登录失败')
			this.$message.success('退出登录成功')
            // 清楚sessionStorage数据
            window.sessionStorage.clear()
            // 删除vuex中的数据，让当前页面刷新
            window.location.reload()
            this.$router.push('/login')
        },
        toggle(){
            this.isCollapse=!this.isCollapse
        },
        saveNavState(activePath){
            window.sessionStorage.setItem("activePath", activePath)
            this.activePath = activePath
        },
        showEditDialog(){
            this.dialogVisible=!this.dialogVisible
        },
        // 修改密码
        editPassword(){
            this.$refs.editFormRef.validate(async valid=>{
                if (!valid) return
                const res=await this.$http.post('/user/change_password/',this.editForm)
                console.log(res)
                if(res.data.code !=200)  return this.$message.error('修改失败')
                this.$message.success('密码修改成功!')
                this.dialogVisible=!this.dialogVisible
            })
        },
        // 关闭修改密码对话框
        editClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 展示更换头像对话框 
        showAvatarDialog(){
            this.avatarDialogVisible=!this.avatarDialogVisible
        },
        // 上传文件之前的钩子
       async handleBeforeUpload (file) {
            if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                this.$notify.warning({
                title: '警告',
                message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
                })
            }
            const isLt2M = file.size / 1024 / 1024 <2;
            if (!isLt2M) {
                this.$notify.warning({
                title: '警告',
                message: '图片大小必须小于2M'
              })
            }
        
            let fd = new FormData();
            fd.append("picFile", file); 
            fd.append('token',sessionStorage.getItem('token'));
            // 网络请求
            const res= await this.$http.post('user/upload_image/',fd,{
                headers:{'Content-Type':'multipart/form-data'}
            })
            this.setIcon(res.data.data)
            this.avatarDialogVisible=! this.avatarDialogVisible
        },
        // 文件超出个数限制时的钩子
        handleExceed (files, fileList) {
            this.$message.error("上传图片不能超过1张!");
        },
        // 文件列表移除文件时的钩子
        handleRemove (file, fileList) {
            this.hideUpload = fileList.length >= this.limitNum;
    
        },
        // 点击文件列表中已上传的文件时的钩子
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.imgdialogVisible = true;
        },
        uploadFile () {
            this.$refs.upload.submit()
        },
        imgChange (files, fileList) {
            this.hideUpload = fileList.length >= this.limitNum;
            if (fileList) {
                this.$refs.uploadElement.clearValidate();
            }
        },
        tocancel(){
             this.avatarDialogVisible=! this.avatarDialogVisible
             this.$refs.upload.clearFiles()
        }
    },
    computed:{
            ...mapState(['rightsList','user','icon'])
    },
    watch:{
        '$route':function(to,from){
            this.activePath = to.path
        }
    },
    created(){
            this.activePath = window.sessionStorage.getItem("activePath")
            this.menuList=this.rightsList
            this.openeds=this.menuList.map(item=>{
                return item.icon_id
            })
        }
}

</script>
<style scoped lang="scss">
.home_content,.home{
    height: 100%;
}
.home_content{
    .el-aside{
        background-color: rgb(52, 58, 69);
        border-right: none;
        .el-menu{
            border-right: none;
        }
    }
    .el-container{
        .el-header{
            background-color: rgb(230, 234, 236);
            border-bottom:1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .toggle{
                cursor: pointer;
                width: 50px;
                .icon-shouqi{
                    font-size: 20px;
                }
            }
            .right{
                display: flex;
                height: 60px;
                line-height: 60px;
                .avatar-container{
                    display: flex;
                    padding-left:20px;
                    .avatar-wrapper{
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                }
            }
        }
        .el-main{
            background-color: rgb(230, 234, 236);
            .v-enter{
                opacity: 0;
                transform:translateX(20px)
            }
            .v-leave{
                opacity: 0;
            }
            .v-enter-active,.v-leave-active{
                transition: all 0.8s ease;
            }
        }
    }
}

.iconfont {
  margin-right: 10px;
}

.hide .el-upload--picture-card {
  display: none;
}

.avatarDialogBtns{
    display: flex;
    justify-content: flex-end;
}

</style>