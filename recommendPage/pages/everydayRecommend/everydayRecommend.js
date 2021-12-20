// pages/everydayRecommend/everydayRecommend.js
import request from "../../../utils/request.js";
import PubSub from "pubsub-js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        everydayRecommendList: [],
        index: 0
    },
    // 获取每日推荐数据
    async getMusicList() {
        const res = await request('/recommend/songs')
        this.setData({
            everydayRecommendList: res.recommend
        })
    },
    // 跳转到播放页
    toSongsPlay(e) {
        const { songs, index } = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: "/pages/songsPlay/songsPlay?songs=" + songs
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo) {
            return wx.showToast({
                title: '请先登录',
                icon: 'none',
                success: function (params) {
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                }
            })
        }
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        this.getMusicList()
        // 订阅消息
        PubSub.subscribe('switchType', (msg, type) => {
            let { everydayRecommendList, index} = this.data
            if(type === "up") {
                (index === 0) && (index = everydayRecommendList.length)
                index = index - 1 
            }else {
                (index === everydayRecommendList.length - 1) && (index = -1)
                index = index + 1
            }
            this.setData({index})
            const musicId = everydayRecommendList[index].id
            PubSub.publish("musicId", musicId);
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