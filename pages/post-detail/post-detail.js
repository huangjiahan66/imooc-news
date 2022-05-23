import { postList } from "../../data/data";
const app = getApp();
Page({
  data: {
    postDetail: null,
    collected: false, //收藏 默认False 不收藏
    _pid: null, //当前文章的id
    _postCollected: {},
    _mgr: null,
    isPlaying: false, //  默认不播放
  },
  onLoad(options) {
    const pid = options.pid; //文章pid
    const postDetail = postList[pid];
    this.data._pid = options.pid;
    const postsCollected = wx.getStorageSync("posts_collected");
    this.data._postCollected = postsCollected;
    const collected = postsCollected[this.data._pid];
    //  console.log(collected);
    this.setData({
      postDetail,
      collected,
      isPlaying: this.currentPostMusicePlaying(),
    });

    const mgr = wx.getBackgroundAudioManager(); //获取播放音乐实例
    this.data._mgr = mgr;
    mgr.onPlay(() => {
      this.onMusicStart;
    });
    mgr.onPause(() => {
      this.onMusicStart;
    });
  },

  currentPostMusicePlaying() {
    if (app.gIsPlayingMusic) {
      if (app.gIsPlayingPostId === this.data._pid) {
        return true;
      }
      return false;
    }
    return false;
  },

  onCollect() {
    const postCollected = this.data._postCollected;
    postCollected[this.data._pid] = !this.data.collected;

    this.setData({
      collected: !this.data.collected,
    });
    wx.setStorageSync("posts_collected", postCollected);
    wx.showToast({
      title: this.data.collected ? "收藏成功" : "取消收藏",
      duration: 3000,
    });
  },
  async onShare() {
    const res = await wx.showActionSheet({
      itemList: ["分享到qq", "分享到微信"],
    });
    console.log(res);
  },

  onMusicStart() {
    const mgr = this.data._mgr;
    // mgr.onPlay(() => {
    //   console.log(111);
    // });
    //  console.log(mgr);
    mgr.src = postList[this.data._pid].music.url;
    mgr.title = postList[this.data._pid].music.title;
    mgr.coverImgUrl = postList[this.data._pid].music.coverImg;

    app.gIsPlayingMusic = true;
    app.gIsPlayingPostId = this.data._pid;
    this.setData({
      isPlaying: true,
    });
  },

  onMusicStop() {
    const mgr = wx.getBackgroundAudioManager();
    mgr.pause();
    app.gIsPlayingMusic = false;
    this.setData({
      isPlaying: false,
    });
  },
});
