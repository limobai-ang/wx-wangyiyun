import request from "../../utils/request.js";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        phone: '17771166963',
        password: 'liang123'
    },
    // 监听账号和密码的回调
    handleInput(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value
        })
    },
    async login() {
        const {
            phone,
            password
        } = this.data
        if (!phone) {
            return wx.showToast({
                title: "手机号不能为空",
                icon: "error"
            })
        }
        var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if (!(telStr.test(phone))) {
            return wx.showToast({
                title: "手机号格式不正确",
                icon: "error"
            })
        }
        if (!password) {
            return wx.showToast({
                title: "密码不能为空",
                icon: "error"
            })
        }
        // 前端验证通过，发起请求
        const res = await request('/login/cellphone', {
            phone,
            password,
            isLogin: true
        })
        console.log(res);
        if (res.code === 200) {
            wx.setStorageSync('userInfo', JSON.stringify(res.profile))
            wx.setStorageSync('token', res.token)
            wx.reLaunch({
              url: '/pages/personal/personal',
            })
        }else if (res.code === 501) {
            wx.showToast({
                title: "账号不存在",
                icon: "error"
            })
        }else if (res.code === 502) {
            wx.showToast({
                title: "密码错误",
                icon: "error"
            })
        }else {
            wx.showToast({
                title: "登录失败，请重新登录",
                icon: "error"
            })  
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})