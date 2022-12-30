<template>
	<view>
		<view class="login-container">
			<!-- 提示登录的图标 -->
			<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
			<!-- 登录按钮 -->
			<!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
			<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
			<!-- 登录提示 -->
			<view class="tips-text">登录后尽享更多权益</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {

			};
		},
		methods: {
			   // 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
			    ...mapMutations('m_user', ['updateUserInfo']),
			//获取微信用户的基本信息
			getUserInfo(e) {
				//判断是否获取信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				//获取用户信息成功,  e.detail.userInfo 就是用户基本信息
				// 3. 将用户的基本信息存储到 vuex 中
				this.updateUserInfo(e.detail.userInfo)
			},
			// 调用登录接口，换取永久的 token
			async getToken(info) {
			  // 调用微信登录接口
			  const [err, res] = await uni.login().catch(err => err)
			  // 判断是否 uni.login() 调用失败
			  if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
			
			  // 准备参数对象
			  const query = {
			    code: res.code,
			    encryptedData: info.encryptedData,
			    iv: info.iv,
			    rawData: info.rawData,
			    signature: info.signature
			  }
			
			  // 换取 token
			  const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
			  if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
			  uni.$showMsg('登录成功')
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
