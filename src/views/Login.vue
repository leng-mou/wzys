<template>
	<div class="login_container">
		<div class="login_system">
			<span>电商物资验收系统</span>
		</div>
		<div class="login_box">
			<!-- 图标 -->
			<div class="avatar_box">
				<img src="../assets/images/4.jpg" alt="">
			</div>
			<!-- 用户名 -->
			<el-form ref="Ref" :model="loginForm" :rules="rules" label-width="80px" class="login_form">
			  <el-form-item prop="username">
			    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="3-6个字符"></el-input>
			  </el-form-item>
			
			<!-- 密码 -->
			
			  <el-form-item prop="password">
			    <el-input v-model="loginForm.password" prefix-icon="el-icon-s-goods
" type="password" placeholder="6-10个字符"></el-input>
			  </el-form-item>

			<!-- 按钮区域 -->
			  <el-form-item class="btns">
			  	 <el-button type="primary" @click="login">登录</el-button>
			  	 <el-button type="info" @click="reset">重置</el-button>
			  </el-form-item>
			</el-form>

			
		</div>
	</div>
</template>

<script>
import {initDynamicRoutes} from '@/router'
export default{
	name:'Login',
	data(){
		return {
			loginForm:{
				username:'',
				password:'',
			},
			rules:{
				username:[
					{ required: true, message: '请输入登录名称', trigger: 'blur'},
					{ min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
				],
				password:[
				{ required: true, message: '请输入密码', trigger: 'blur'},
				{ min: 6, max: 10, message: '长度在 6 到 10个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods:{
		reset(){
			this.$refs.Ref.resetFields()
		},
		login(){
			this.$refs.Ref.validate(async valid=>{
				if(!valid) return
				const {data:res} =await this.$http.post('/user/login/',this.loginForm)
				if(res.code !==200) return this.$message({type:'error',message:res.message})
				this.$message({type:'success',message:res.message})
	
				this.$store.commit('setRightsList',res.data.right)
				this.$store.commit('setUser',res.data.user.username)
				this.$store.commit('setIcon',res.data.user.icon)
				//将登录成功之后的token,保存到客户端的sessionStorage中
				window.sessionStorage.setItem('token',res.data.user.token)
				// 根据用户权限
				initDynamicRoutes()
				this.$router.push('/home')
			})
			
		}
	}
}
</script>


<style scoped lang="scss">
	.login_container{
		background-color: #2b4b6b;
		height: 100%;
		background: url('../assets/images/1.jpg') no-repeat center/100%; 
	}
	.login_system{
		color: #fff;
		font-size: 30px;
		position: absolute;
		top:20%;
		left:50%;
		transform: translate(-50%,-50%);
	}
	.login_box{
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		top:60%;
		left:50%;
		transform: translate(-50%,-50%);
	}
	.avatar_box{
		width: 130px;
		height: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding:10px;
		position: absolute;
		left:50%;
		transform: translate(-50%,-50%);
		background-color: #fff;
	}
	.avatar_box img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}

	.login_form{
		position: absolute;
		bottom:0;
		width: 100%;
		.el-input{
			width: 290px;
		}
	}
	.btns{
		display: flex;
		justify-content: center;
		transform: translate(-10%,0);
	}
</style>