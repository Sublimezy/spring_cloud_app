import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
	login,
	logout,
	getInfo
} from '@/api/login'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'

const baseUrl = config.baseUrl

const user = {
	state: {
		token: getToken(),
		name: storage.get(constant.name),
		avatar: storage.get(constant.avatar),
		roles: storage.get(constant.roles),
		permissions: storage.get(constant.permissions),
		userId: storage.get(constant.userId),
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, name) => {
			state.name = name
			storage.set(constant.name, name)
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
			storage.set(constant.avatar, avatar)
		},
		SET_USERID: (state, userId) => {
			state.userId = userId
			storage.set(constant.userId, userId)
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
			storage.set(constant.roles, roles)
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.permissions = permissions
			storage.set(constant.permissions, permissions)
		}
	},

	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			const userName = userInfo.userName.trim()
			const password = userInfo.password
			const code = userInfo.code
			const uuid = userInfo.uuid
			const source = userInfo.source
			return new Promise((resolve, reject) => {
				login(userName, password, code, uuid, source).then(res => {
					let data = res.data
					setToken(data.access_token)
					commit('SET_TOKEN', data.access_token)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				getInfo().then(res => {
					const user = res.user
					const avatar = (user == null || user.avatar == "" || user.avatar == null) ?
						require("@/static/images/profile.jpg") : user.avatar
					const userName = (user == null || user.userName == "" || user.userName ==
						null) ? "" : user.userName

					if (res.roles && res.roles.length > 0) {
						commit('SET_ROLES', res.roles)
						commit('SET_PERMISSIONS', res.permissions)
					} else {
						commit('SET_ROLES', ['ROLE_DEFAULT'])
					}
					commit('SET_NAME', userName)
					commit('SET_AVATAR', avatar)
					commit('SET_USERID', user.userId)
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 退出系统
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				logout(state.token).then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', [])
					commit('SET_PERMISSIONS', [])
					commit('SET_NAME', '')
					commit('SET_AVATAR', '')
					removeToken()
					storage.clean()
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	}
}

export default user