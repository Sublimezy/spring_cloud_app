const getters = {
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.name,
	userId: state => state.user.userId,
	roles: state => state.user.roles,
	permissions: state => state.user.permissions,
	lng: state => state.map.lng,
	lat: state => state.map.lat,
	address: state => state.map.address,
}
export default getters