// pages/songsPlay/songsPlay.js
import request from "../../../utils/request.js";
import PubSub from "pubsub-js"
import moment from 'moment';
var appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        musicId: 0,
        musicInfo: {},
        currentTime: "00:00",
        totalTime: "00:00",
        currentWidth: 0

    },
    // 点击播放回调
     setPlya() {
        // 改变播放状态
        this.setData({
            isPlay: !this.data.isPlay
        })
        // 初始化实例
        if (!this.BackgroundAudioManager) {
            return this.initInstantiation()
        }

        this.musicControl()
    },
    // 改变APP() 公共数据
    setAppData (isMusicPlay){
        appInstance.globalData.isMusicPlay = isMusicPlay
        appInstance.globalData.musicId = this.data.musicId
    },
    // 初始化实例
    async initInstantiation () {
        const res = await request(`/song/url?id=${this.data.musicId}`)
        const url = res.data[0].url
        this.BackgroundAudioManager = wx.getBackgroundAudioManager()
        this.BackgroundAudioManager.src = url
        this.BackgroundAudioManager.title = this.data.musicInfo.name
        // this.BackgroundAudioManager.pause()
        this.BackgroundAudioManager.onPlay(() => {
            this.setData({
                isPlay: true
            })
            this.setAppData(true)
        })
        this.BackgroundAudioManager.onPause(() => {
            this.setData({
                isPlay: false
            })
            this.setAppData(false)
        })
        this.BackgroundAudioManager.onStop(() => {
            this.setData({
                isPlay: false
            })
            this.setAppData(false)
        })
        this.BackgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss');
            const currentWidth = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
        this.BackgroundAudioManager.onEnded(() => {
            this.setData({
                isPlay: false,
                currentTime: "00:00",
                currentWidth: 0
            })
            PubSub.subscribe('musicId', async (msg, data) => {
                this.setData({
                    musicId: data
                })
                this.getMusicInfo()
                // 重新创建替换之前的实例
                this.initInstantiation ()
                this.setData({
                    isPlay: true
                })
                // 取消订阅
                PubSub.unsubscribe('musicId')
            })
            PubSub.publish("switchType", "next");
        })
    },
    // 控制歌曲播放和暂停
    async musicControl() {
        if (this.data.isPlay) {
            this.BackgroundAudioManager.play()
        } else {
            this.BackgroundAudioManager.pause()
        }
    },
    // 获取歌曲信息
    async getMusicInfo() {
        const res = await request(`/song/detail?ids=${this.data.musicId}`)
        if (res.code !== 200) {
            console.log("数据获取失败");
            return
        }
        const totalTime = moment(res.songs[0].dt).format('mm:ss');
        this.setData({
            musicInfo: res.songs[0],
            totalTime
        })
        wx.setNavigationBarTitle({
            title: "当前歌曲：" + res.songs[0].name
        })
    },
    // 上一曲和下一曲
    tactilePlayer(e) {
        this.setData({
            isPlay: false
        })
        const type = e.currentTarget.dataset.type
        PubSub.subscribe('musicId', async (msg, data) => {
            this.setData({
                musicId: data
            })
            this.getMusicInfo()
            // 重新创建替换之前的实例
            this.initInstantiation ()
            this.setData({
                isPlay: true
            })
            // 取消订阅
            PubSub.unsubscribe('musicId')
        })
        PubSub.publish("switchType", type);
    },
    // 控制进度条

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({musicId: options.songs})
        // 判断当前的歌曲是否正在播放
        if(appInstance.globalData.isMusicPlay && options.songs == appInstance.globalData.musicId) {
            this.setData({
                isPlay: true
            })
        }
        this.getMusicInfo()
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