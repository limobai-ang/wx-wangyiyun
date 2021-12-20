// pages/index/index.js
import $request from "../../utils/request.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图数据
        banners: [],
        recommends: [],
        rankingData: []
    },
    toEverydayRecommend () {
        wx.navigateTo({
            url: '/recommendPage/pages/everydayRecommend/everydayRecommend'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 获取轮播图、推荐歌曲数据
        const bannerData = await $request('/banner?type=2')
        const recommendsData = await $request('/personalized?limit=6')
        // // 获取排行数据
        let index = 0
        const arr = []
        while(index < 5){
            const rankingData = await $request('/top/list',{idx: index++})
            let topListData = {name: rankingData.playlist.name, tracks: rankingData.playlist.tracks.slice(0,3)}
            arr.push(topListData)
            this.setData({
                rankingData: arr
            })
        }
        // 渲染数据到页面
        this.setData({
            banners: bannerData.banners,
            recommends: recommendsData.result,
            rankingData: arr
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