import request from '@/utils/request'

// 登录方法
export function login(userName, password, code, uuid, source) {
	const data = {
		userName,
		password,
		code,
		uuid,
		source
	}
	console.log(data)
	return request({
		'url': '/auth/login',
		headers: {
			isToken: false
		},
		'method': 'post',
		'data': data
	})
}

// 注册方法
export function register(data) {
	return request({
		url: '/auth/register',
		headers: {
			isToken: false
		},
		method: 'post',
		data: data
	})
}

// 获取用户详细信息
export function getInfo() {
	return request({
		'url': '/appUser/appUser/getAppUserInfo',
		'method': 'get'
	})
}

// 退出方法
export function logout() {
	return request({
		'url': '/auth/logout',
		'method': 'delete'
	})
}

// 获取验证码
export function getCodeImg(data) {
	return request({
		'url': '/code',
		headers: {
			isToken: false
		},
		method: 'post',
		timeout: 20000,
		data: data
	})
}

export function getEmail(data) {
	return request({
		url: '/email/email/sendEmail',
		headers: {
			isToken: false
		},
		method: 'post',
		timeout: 20000,
		data: data
	})
}