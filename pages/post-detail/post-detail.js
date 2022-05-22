import { postList } from "../../data/data";
Page({
  data: {
    postDetail: null,
  },
  onLoad(options) {
    const pid = options.pid;

    const postDetail = postList[pid];

    this.setData({
      postDetail,
    });
  },
});
