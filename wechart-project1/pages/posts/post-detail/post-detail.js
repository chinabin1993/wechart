import {
  postList
} from '../../../data/post-data.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlayMusic:false,
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(option) {
      let that = this;
      var postId = option.id;
      var postData = postList[postId];
      this.setData({
        postData: postData,
        currentPostId: postId
      })
      var postsCollected = wx.getStorageSync('posts-collected');
      if (postsCollected) {
        var collected = postsCollected[postId];
        console.log(collected);
        this.setData({
          collected: collected
        })
      } else {
        postsCollected = {};
        postsCollected[postId] = false;
        wx.setStorageSync('posts-collected', postsCollected)
      }
      // 兼听音乐
      var BackgroundAudioManager = wx.getBackgroundAudioManager();
      BackgroundAudioManager.onPlay(function(){
        that.setData({
          isPlayMusic:true
        })
      })
      BackgroundAudioManager.onPause(function(){
        that.setData({
          isPlayMusic: false
        })
      })
    },
    onCollectionTap: function(event) {
      var postsCollected = wx.getStorageSync('posts-collected');
      var postCollected = postsCollected[this.data.currentPostId];
      postCollected = !postCollected;
      postsCollected[this.data.currentPostId] = postCollected;
      wx.setStorageSync('posts-collected', postsCollected);
      this.setData({
        collected: postCollected
      })
      wx.showToast({
        title: postCollected ? '收藏成功' : '取消收藏',
        duration: 1000
      })
    },
    /**
     * 清除缓存
     * 缓存的上限最大不能超过10MB
     */
    onShareTap: function(event) {
      // 清除单个缓存
      wx.removeStorage({
        key: 'key',
        success: function(res) {},
      })
      // 清除所有
      // wx.clearStorage();
    },
    onShareTap: function(event) {
      var itemList = ['分享给微信好友', '分享到朋友圈', '分享到微博', '分享到QQ'  ]
      wx.showActionSheet({
        itemList: itemList,
        itemColor: '#405f80',
        success: function(res) {
          console.log(res);
          wx.showModal({
            title: '分享',
            content: '用户分享到了' + itemList[res.tapIndex],
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },
        fail: function(err) {
          console.log('err', err);
        },
        complete: function(res) {

        }
      })
    },
    onMusicTap: function(event) {
      var isPlayMusic = this.data.isPlayMusic;
      var currentPostId = postList[this.data.currentPostId].music;
      var BackgroundAudioManager = wx.getBackgroundAudioManager();
      if (isPlayMusic){
        BackgroundAudioManager.pause();
        this.setData({
          isPlayMusic:false
        })
      }else{
        BackgroundAudioManager.src = currentPostId['url'];
        BackgroundAudioManager.title = currentPostId['title'];
        // 专辑名称
        
        // 歌手名
        BackgroundAudioManager.singer = currentPostId['currentPostId'];
        // 封面
        BackgroundAudioManager.coverImgUrl = currentPostId['coverImg'];
        this.setData({
          isPlayMusic: true
        })
      }
    }
  }
})