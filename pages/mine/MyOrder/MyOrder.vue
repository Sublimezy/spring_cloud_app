<template>
	<view>
		<view style="width: 100%;height: 34px;border: 1;">


			<view class="search">
				<u-subsection @change="sectionChange" bgColor="#F4F4F4" activeColor="#F9AE3D" mode="button" :list="list"
					:current="searchParams.status"></u-subsection>
			</view>
		</view>


		<view class="contain">


			<view v-for="(item,index) in userOrderList" :key="index" class="contain-item">


				<view class="contain-item-title">
					<view class="main-content-item-text">
						<text class="shoplist-item-info-name">{{item.eventName}}</text>
					</view>
					<view style="width: 60px;">
						<text v-if="item.status==='1'">待付款</text>
						<text v-if="item.status==='2'">待评价</text>
						<text v-if="item.status==='3'">已付款</text>

					</view>

				</view>
				<view class="horizontal-line"></view>

				<view class="contain-item-image">



					<image :src="item.remark">
					</image>


					<view class="contain-item-image-text">
						<text class="shoplist-item-info-area">下单时间 {{item.paymentTime}}</text>
						<text class="shoplist-item-info-area">总价 {{item.totalAmount}}</text>
					</view>
				</view>
				<view class="contain-item-button">
					<view><button class="pingjia" v-if="item.status==='2'">评价</button></view>
					<view><button class="zailai">再来一单</button></view>



				</view>
			</view>






		</view>

	</view>
</template>

<script>
	import {
		listOrder
	} from '@/api/userOrder/userOrder'
	import store from "@/store";
	export default {
		data() {
			return {
				list: ['全部', '未付款', '待评价', '已付款'],

				searchParams: {
					userId: store.getters.userId,
					pageNum: 1,
					pageSize: 999,
					status: 0
				},
				userOrderList: []
			}
		},
		methods: {

			sectionChange(index) {
				this.searchParams.status = index;
				this.getOrderList()
			},
			getOrderList() {
				console.log(this.searchParams)
				listOrder(this.searchParams).then(res => {
					this.userOrderList = res.rows
				})
			}
		},
		onLoad() {
			this.getOrderList()
		},
	}
</script>

<style>
	.shoplist-item-info-name {
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
		color: black;
		font-size: 13px;
	}

	.main-content-item-text {
		width: 100%;
		/* 视需求设置容器宽度 */
		padding: 1px;
	}

	.horizontal-line {
		width: 100%;
		/* 横线的宽度 */
		height: 2rpx;
		/* 横线的高度 */
		background-color: #cccccc;
		/* 横线的颜色 */

	}

	.shoplist-item-info-area {
		width: 100%;
		display: flex;
		color: #7F7F7F;
		font-size: 9px;


	}

	.zailai {
		margin-left: 10px;
		height: 25px;
		background-color: #FFD101;
		font-size: 10px;
		border: none;
	}

	.zailai::after {
		border: 0; // 或者 border: none;
	}

	.pingjia {

		height: 25px;
		background-color: #fff;
		border-color: #C4C4C4;
		font-size: 10px;
	}

	.topNav {
		position: fixed;
		z-index: 999;
	}

	.contain {
		display: flex;
		flex-direction: column;
		padding: 0px 10px 0px 5px;
	}

	.contain-item {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 6px;
		padding: 5px 10px 5px 10px;
		margin-bottom: 7px;
	}

	.contain-item-title {
		display: flex;
		justify-content: space-between;
		padding-top: 6px;
		padding-bottom: 6px;
		flex: 1;
	}

	.contain-item-image {
		padding-top: 6px;
		padding-bottom: 6px;
		display: flex;
		justify-content: space-between;
	}

	.contain-item-image image {
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}

	.contain-item-image-text {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin-left: 6px;
		justify-content: space-evenly;
	}

	.contain-item-button {
		display: flex;
		justify-content: flex-end;
	}

	.search {
		background-color: #FFC300;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;

	}
</style>