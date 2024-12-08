import StroageUtils  from './storage'
const API_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:13245' : 'https://mini.cn.reai.com'
const API_HOST2  =  'https://hd.cn.reai.com'

const request = async (url , method ,host, data  = {}, headers = {} ) => {
	let token = StroageUtils.get("AUTH_TOKEN") || ""
	let HOST = ''
	console.log('host--->',host);
	if(host === 'host1'){
		HOST = API_HOST
	}else if(host === 'host2'){
		HOST = API_HOST2
	}
	
	console.log("token", token)
	if (token) {
		headers.Authorization = 'Bearer ' + token
	}
	console.log("request", url, method, data)
	try {
		return new Promise((resolve,reject)=>{
			uni.request({
				method: method,
				url: HOST + url,
				data,
				dataType: 'json',
				header: headers,
				success: res=>{
					if (res.statusCode !== 200) {
						resolve ({ code: res.statusCode, message: res.errMsg })
					}else{
						resolve(res.data)
					}
				},
				fail: err=>{
					reject(err)
				}
			})
		})
		// let ret = await uni.request({
		// 	method: method,
		// 	url: HOST + url,
		// 	data,
		// 	dataType: 'json',
		// 	header: headers
		// })
		// console.log("request ret", url,ret, ret.statusCode, ret.data)
		// if (ret.statusCode !== 200) {
		// 	return { code: ret.statusCode, message: ret.errMsg }
		// }
		// return ret.data

	} catch (err) {
		console.log("request err", err)
		return { code: -1, message: err.message } 
	}

}
export default{
	apiGet : async (url  ,host = "host1" ) => {
		let ret  = await request(url, 'GET',host)
		return ret
	},
	 apiPost : async (url , data  = {},host = "host1") => {
		let ret = await request(url, 'POST', data,host)
		return ret
	},
	 apiSetToken : async (token , expiresIn) => {
		StroageUtils.set("AUTH_TOKEN", token, expiresIn)
	}
}
