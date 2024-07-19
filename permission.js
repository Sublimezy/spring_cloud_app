import { getToken } from '@/utils/auth'

// 登录页面
const loginPage = "/pages/login"
// 个人中心页面
const minePage = "/pages/mine"
  
// 需要鉴权的urlss
const whiteList = [
     'pages/mine/**'
]

// 检查地址白名单
function checkWhite(url) {
  const path = url.split('?')[0]
  return whiteList.indexOf(path) !== -1
}





// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
	
  uni.addInterceptor(item, {
    invoke(to) {
	console.log(to.url)
	console.log("开始判断路由")
		if(to.url.includes(minePage)){
			if (!getToken()) {
			   uni.reLaunch({ url: loginPage })
			  return false
			} 
		}
	  return true
    },
    fail(err) {
      console.log(err)
    }
	
	
  })
})



