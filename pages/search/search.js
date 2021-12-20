// pages/search/search.js
import request from "../../utils/request.js";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchDefault: '',
        hotList: [],
        searchResultList: [],
        searchContent: '',
        historyList: []
    },
    // 默认搜索关键字接口
    async getSearchDefault() {
        const res = await request('/search/default');
        if (res.code !== 200) {
            return console.log("获取失败");
        }
        this.setData({
            searchDefault: res.data.realkeyword
        })
    },
    // 热搜榜接口
    async getSearchHot() {
        const res = await request('/search/hot/detail');
        if (res.code !== 200) {
            return console.log("获取失败");
        }
        this.setData({
            hotList: res.data
        })
    },
    // 获取收索结果
    async getSearchResult(name) {
        const { historyList, searchContent } = this.data
        const res = await request('/search', {
            keywords: name,
            limit: 10
        });
        if (res.code !== 200) {
            return console.log("获取失败");
        }
        if (this.data.searchContent && this.data.searchContent === name) {
            if (historyList.indexOf(searchContent) == -1) {
                historyList.unshift(searchContent)
                historyList.length > 8 && historyList.pop()
            } else {
                historyList.splice(historyList.indexOf(searchContent), 1)
                historyList.unshift(searchContent)
            }
            this.setData({
                searchResultList: res.result.songs,
                historyList
            })
            wx.setStorageSync('historyList', JSON.stringify(historyList))
        }
    },
    // 搜索框模糊搜索
    searchContent(e) {
        if (e.detail.value.trim() === '') return this.setData({ searchResultList: [] })
        this.timeId && clearInterval(this.timeId)
        this.timeId = setTimeout(() => {
            this.getSearchResult(e.detail.value.trim())
        }, 300)
    },
    // 删除历史记录
    historyDelete(e) {
        wx.showModal({
            content: '确认删除历史记录吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.clearStorageSync('historyList')
                    this.setData({
                        historyList: []
                    })
                }
            }
        })
    },
    // 清除搜索框文字
    searchRemove(e) {
        this.setData({
            searchContent: '',
            searchResultList: []
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSearchDefault()
        this.getSearchHot()
        wx.getStorageSync('historyList') && this.setData({
            historyList: JSON.parse(wx.getStorageSync('historyList'))
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