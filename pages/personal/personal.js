import request from "../../utils/request.js";
// pages/personal/personal.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        initialIdistance: 0,
        idistance: 0,
        userInfo: {},
        recentlyPlayed: []
    },
    // 触摸滑动函数
    bindtouchstart(e) {
        let n = Math.floor(e.touches[0].pageY)
        this.setData({
            initialIdistance: n
        })
    },
    bindtouchmove(e) {
        let n = Math.floor(e.touches[0].pageY) - 18 - this.data.initialIdistance
        if (n > 0 && n < 75) {
            this.setData({
                idistance: n / 3
            })
        }

    },
    bindtouchend(e) {
        let n = true
        let timerId =  setInterval(() => {
            if(n <= 0) {
                return clearInterval(timerId)
            }
            n =  Math.floor(this.data.idistance -this.data.idistance / 10)
            this.setData({
                idistance: n
            })
            console.log("351351");
        }, 20)
    },
    // 跳转登录页
    toLogin() {
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userInfo = wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : undefined 
        if (userInfo) {
            this.setData({
                userInfo
            })
            // 获取用户播放记录
            this.getRecentlyPlayed(userInfo)
        }
    },
    // 获最近播放记录 
    async getRecentlyPlayed(userInfo) {
        const res = await request('/user/record', {uid: userInfo.userId, type: 1})
        if (res.code !== 200) return false
        this.setData({
            recentlyPlayed: res.weekData.slice(0,10)
        })
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
        // const userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        // if (userInfo) {
        //     this.setData({
        //         userInfo
        //     })
        // }
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