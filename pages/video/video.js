import request from "../../utils/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelData: [],
        labelId: 0,
        videoList: [],
        videoImageId: null,
        videoTime: {},
        updataState: false,
        page: 1
    },
    // 获取标签数据
    async labelData () {
        const res = await request('/video/group/list')
        if(res.code !== 200) return 
        this.setData({
            labelData: res.data.slice(0, 14),
            labelId : res.data[0].id
        })
        // 获取第一项的视频数据
        this.getVideoData()
    },
    // 点击label标签选中
    setActiveIndex(e) {
        this.setData({
            videoList: [],
            labelId: e.currentTarget.dataset.index,
            page: 1
        })
        wx.showLoading({
            title: '加载中'
        })
        this.getVideoData()
    },  
    // 获取标签对应的视频数据
    async getVideoData() {
        const res = await request('/video/group', {id: this.data.labelId})
        wx.hideLoading()
        if(res.code === 200) {
            return this.setData({
                videoList: res.datas,
                updataState : false,
            })
        } else if(res.code === 301) {
            console.log("请先登录");
        }else {
            console.log("视频获取失败");
        }
        this.setData({
            updataState : false
        })
    },
    // 视频单独播放 --- 点击播放/继续播放的回调 ---- 点击播放时关闭上一个正在播放的视频
    setPlay(e) {
        // 点击的是image就展示对应的视频
        if (e.currentTarget.dataset.vid) {
            return this.setData({
                videoImageId: e.currentTarget.dataset.vid
            })
        }
        
        // 第一次进来是没有这个实例的，判断有这个实例，并且上一次实例不是自己
        // let flag = this.VideoContext !== wx.createVideoContext(e.currentTarget.id)
        // 也可以判断id
        // let flag = this.vid !== e.currentTarget.id
        // this.vid = e.currentTarget.id

        // this.VideoContext && flag && this.VideoContext.stop()
        // 将获取的实例放到this上

        // 继续播放 查看播放记录里面有没有记录，有就使用记录的时间
        const vid = e.currentTarget.id
        this.VideoContext = wx.createVideoContext(vid)
        if(this.data.videoTime[vid]) {
            this.VideoContext.seek(this.data.videoTime[vid])
        }

    },
    // 视频播放时记录时长
    videoUpdataTime(e) {
        const { videoTime } = this.data
        const vid = e.currentTarget.id
        const currentTime = e.detail.currentTime
        videoTime[vid] = currentTime
        this.setData({
            videoTime
        })      
    },
    // 视频播放结束
    videoEnded(e) {
        const { videoTime } = this.data
        const vid = e.currentTarget.id
        const currentTime = undefined
        videoTime[vid] = currentTime
        this.setData({
            videoTime
        })  
        
    },
    // 下拉刷新
    updataVideo(e) {
        this.getVideoData()
    },
    // 上拉触底 加载更多视频
    async addVideoData() {
        const res = await request('/video/group', {id: this.data.labelId, offset: this.data.page})
        let { videoList } = this.data
        videoList.push(...res.datas)
        this.setData({
            page: ++this.data.page,
            videoList
        })
        console.log(res);
        
    },
    // 跳转搜索页
    toSearch() {
        wx.navigateTo({
            url: '/pages/search/search'
        })  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // 
    onLoad: function (options) {
        this.labelData()
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
    onShareAppMessage: function ({ from }) {
        // console.log(from);
        return {
            path: "/pages/video/video"
        }
    }
})