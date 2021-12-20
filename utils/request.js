// 引入配置文件
import config from "./config.js";

// 封装ajax请求
export default (url, data = {}, method = 'get') => {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: config.host + url,
            data,
            method,
            header: {
                cookie: `MUSIC_U=${wx.getStorageSync('token')};`
            },
            success(res) {
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}