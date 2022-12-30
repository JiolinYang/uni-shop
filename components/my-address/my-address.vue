<template>
	<view>

		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>

		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：<text>{{address.userName}}</text></view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：<text>{{address.telNumber}}</text></view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>

		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	// 1. 按需导入 mapState 和 mapMutations 这两个辅助函数
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {
				// 2.1 注释掉下面的 address 对象，使用 2.2 中的代码替代之
				// address: {}
			}
		},
		methods: {
			// 3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
			...mapMutations('m_user', ['updateAddress']),
			// 选择收货地址
			async chooseAddress() {
				const [err, succ] = await uni.chooseAddress().catch((err) => err)

				// 用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// 3.2 把下面这行代码注释掉，使用 3.3 中的代码替代之
					// this.address = succ

					// 3.3 调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面
					this.updateAddress(succ)
					console.log(succ);
				}
			},
		},
		computed: {
			// 2.2 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
			...mapState('m_user', ['address']),
			// 将 m_user 模块中的 addstr 映射到当前组件中使用
			...mapGetters('m_user', ['addstr']),
			// 收货详细地址的计算属性
			addstr() {
				if (!this.address.provinceName) return ''

				// 拼接 省，市，区，详细地址 的字符串并返回给用户
				return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
			},
		},
	}
</script>

<style lang="scss">
	// 底部边框线的样式
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	// 选择收货地址的盒子
	.address-choose-box {
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	// 渲染收货信息的盒子
	.address-info-box {
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;

		// 第一行
		.row1 {
			display: flex;
			justify-content: space-between;

			.row1-right {
				display: flex;
				align-items: center;

				.phone {
					margin-right: 5px;
				}
			}
		}

		// 第二行
		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;

			.row2-left {
				white-space: nowrap;
			}
		}
	}
</style>
