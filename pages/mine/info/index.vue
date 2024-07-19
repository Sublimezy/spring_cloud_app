<template>
  <view class="container">
    <uni-list>
		<uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="账号" :rightText="user.userName" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="姓名" :rightText="user.nickName" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机号码" :rightText="user.phonenumber" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'email-filled'}" title="邮箱" :rightText="user.email" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'calendar-filled'}" title="创建日期" :rightText="user.createTime" />
    </uni-list>
  </view>
</template>

<script>
  import { getInfo } from "@/api/login"

  export default {
    data() {
      return {
        user: {},
      }
    },
	onLoad() {
		this.getUser()
	},
    methods: {
      getUser() {
        getInfo().then(response => {
          this.user = response.user
        })
	
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #ffffff;
  }
</style>
