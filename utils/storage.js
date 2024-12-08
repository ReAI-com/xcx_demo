

export default {
	
	 set:(key, data, expiresIn)=> {
		const expires = expiresIn ? Date.now() / 1000 + expiresIn : 0
		const item = {
			data,
			expires
		}
		uni.setStorageSync(key, JSON.stringify(item))
	},
	
	 get:(key)=> {
		const val = uni.getStorageSync(key)
		console.log("STORAGE get", val)
		if (!val) {
			return null
		}
		
		try {
			const json = JSON.parse(val) 
			if (json.expires > 0 && json.expires < Date.now() / 1000) {
				return undefined
			}
			
			return json.data
		} catch (err) {
			return null
		}
	}
}