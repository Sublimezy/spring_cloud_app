<template>
	<view class="trade-con">
		<view class="trade-top">

			<view class="trade-top-top">
				<view class="trade">
					<view class="trade-left">
						<image :src="shopEventInfo.eventLogo"></image>
					</view>

					<view class="trade-info">
						<view class="main-content-item-text">
							<text class="main-content-item-title">{{shopEventInfo.eventName}}</text>
						</view>

						<text
							class="main-content-item-info">{{shopEventInfo.startDate}}至{{shopEventInfo.endDate}}</text>
						<text class="main-content-item-info">随时退.过期自动退.到店</text>

					</view>

					<view class="trade-right">
						<u-number-box integer :min="1" :max="100" @change="valChange" v-model="tradeFrom.itemCount">
							<view slot="minus" class="minus">
								<u-icon name="minus" size="8"></u-icon>
							</view>
							<text slot="input" style="width: 15px;text-align: center;"
								class="input">{{tradeFrom.itemCount}}</text>
							<view slot="plus" class="plus">
								<u-icon name="plus" color="#FFFFFF" size="8"></u-icon>
							</view>
						</u-number-box>
					</view>

				</view>

				<view class="trade-varchar">
					<view style="display: flex;">
						<u-icon name="http://127.0.0.1:9000/shop2/2024/06/15/红包_20240615170558A004.png" color="#FFFFFF"
							size="12"></u-icon>

						<text style="font-size: 12px;">红包/抵用劵 </text>

					</view>
					<view>
						<text style="color: red;">暂无</text>
						<text>></text>
					</view>
				</view>

				<view class="horizontal-line"></view>

				<view class="trade-varcharinfo">

					<view>
						<text>优惠</text>
						<text style="color: red;">￥0</text>
					</view>
					<view>
						<text>小计</text>
						<text style="color: red;">￥{{totalMount}}</text>
					</view>

				</view>
			</view>

			<view class="trade-top-middle">
				<text>评价后享</text>
				<view>
					<text>评价可得最高</text>
					<text style="color: red;">100积分</text>
				</view>

			</view>



		</view>
		<u-toast ref="uToast"></u-toast>
		<view class="submit">
			<view class="submit-text">

				<view style="color: red;">
					<text style="font-size: 10px;">合计</text>
					<text><text style="font-size: 10px;">￥</text><text
							style="font-size: 16px;font-weight: bold;">{{totalMount}}</text>
					</text>
				</view>
				<text class="main-content-item-info">共{{tradeFrom.itemCount}}件 已优惠￥0</text>
			</view>

			<view>

				<u-button @click="tradeOrder" size="small" text="提交订单"
					color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		addOrder
	} from '@/api/userOrder/userOrder'
	import store from "@/store";
	export default {
		data() {
			return {

				shopEventInfo: {},
				totalMount: 0,
				tradeFrom: {
					itemCount: 1,
					shopId: "",
					userId: "",
					shopEventId: "",

				},
				defaultNomareOnloadToast: {
					type: 'success',
					message: "成功下单",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				},
			}
		},
		methods: {
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url
						})
					}
				})
			},
			valChange(e) {
				console.log('当前值为: ' + e.value)
				this.totalMount = this.shopEventInfo.amount * e.value
			},
			tradeOrder() {
				addOrder(this.tradeFrom).then(res => {
					let data = res.data
					this.showToast(this.defaultNomareOnloadToast)

					this.$tab.navigateTo(`../../mine/MyOrder/MyOrder`);

					resolve()
				}).catch(error => {
					reject(error)
				})
			}
		},
		onLoad(options) {
			// 解析传递过来的参数对象
			this.shopEventInfo = JSON.parse(decodeURIComponent(options.shopEventInfo));
			this.totalMount = this.shopEventInfo.amount

			this.tradeFrom.shopId = options.shopId
			this.tradeFrom.shopEventId = this.shopEventInfo.id
			this.tradeFrom.userId = store.getters.userId

			console.log("查看参数")
			console.log(this.tradeFrom.shopId)
			console.log(this.tradeFrom.shopEventId)
			console.log(this.tradeFrom.userId)
		},
	}
</script>

<style lang="scss">
	.trade-varchar {
		display: flex;
		justify-content: space-between;
		padding: 5px 0px 5px 0px;
	}

	.main-content-item-info {
		display: inline-block;
		padding-top: 3px;
		color: #7F7F7F;
		font-size: 9px;
	}

	.main-content-item-title {
		color: black;
		font-size: 14px;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5em;
		/* 根据需要设置行高 */
		max-height: 1.5em;
		/* 行高乘以显示行数 */
		white-space: normal;
	}

	.main-content-item-text {

		width: 100%;
		/* 视需求设置容器宽度 */
		padding: 1px;
	}

	.submit-text {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.submit {
		display: flex;
		background-color: #fff;
		box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1);
		/* 设置阴影效果 */
		justify-content: space-between;
		align-items: center;
		padding: 10px;
	}

	.trade-varcharinfo {
		display: flex;
		justify-content: flex-end;
		padding-top: 10px;
	}

	.horizontal-line {
		width: 100%;
		/* 横线的宽度 */
		height: 1rpx;
		/* 横线的高度 */
		background-color: #cccccc;
		/* 横线的颜色 */

	}

	.trade-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding-left: 10px;
		padding-right: 10px;
	}

	.trade-left {
		display: flex;
	}

	.trade-left image {
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}

	.trade-top-top {
		padding: 10px;
		background-color: #fff;
		border-radius: 6px;
	}

	.trade-top-middle {
		padding: 10px;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		border-radius: 6px;

	}

	.trade-right {
		display: flex;
		width: 65px;
	}

	.trade-con {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: space-between;
	}

	.trade {
		display: flex;
	}

	.trade-top {
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 5px;
		display: flex;
		flex-direction: column;
	}

	.minus {
		width: 15px;
		height: 15px;
		border-width: 1px;
		border-color: #E6E6E6;
		border-style: solid;
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
		@include flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		padding: 0 10px;
	}

	.plus {
		width: 15px;
		height: 15px;
		background-color: #FF0000;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}
</style>