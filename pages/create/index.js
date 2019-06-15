// pages/create/index.js
var INFO = wx.getSystemInfoSync();
var util = require('../../utils/util.js');
var TAGS = [
  {
    id: '1',
    name: '无聊'
  }, {
    id: '2',
    name: '快乐'
  }, {
    id: '3',
    name: '激动'
  }, {
    id: '4',
    name: '满足'
  }, {
    id: '5',
    name: '悲伤'
  }, {
    id: '6',
    name: '纠结'
  }
];
var PRIVERS = [
  {
    id: '0',
    name: '平淡'
  }, {
    id: '1',
    name: '有趣'
  }, {
    id: '2',
    name: '难忘'
  }
];
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    WIDTH: INFO.screenWidth,
    STATUS_HEIGHT: INFO.statusBarHeight,
    tags: TAGS,
    current_tag: TAGS[0],
    PRIVERS,
    CURRENT_PRIVER: PRIVERS[0],
    TITLE: '',
    CONTENT: '',
    content_focus: true,
    IMAGE: [],
    UPLOADEDIMAGE: [],
    COUNT: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);
    var bean = JSON.parse(options.model);
    var TIME = util.formatTime(new Date());
    this.setData({
      datas:bean,
      time:TIME,
      TITLE: wx.getStorageSync('CREATE_TITLE'),
      CONTENT: wx.getStorageSync('CREATE_CONTENT'),
      current_tag: TAGS[parseInt(wx.getStorageSync('CREATE_TAG'))] || TAGS[0],
      CURRENT_PRIVER: PRIVERS[parseInt(wx.getStorageSync('CREATE_PRIVER'))] || PRIVERS[0],
      COUNT: 3,
      UPLOADEDIMAGE: wx.getStorageSync('CREATE_UPLOADEDIMAGE')
    });
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
  // 后退
  goBackHandler: function () {
    wx.navigateBack({});
  },
  // 选择标签
  selectTagHandler: function (e) {
    var { value } = e.detail;
    var id = parseInt(value);
    this.setData({
      current_tag: TAGS[id]
    });
    wx.setStorageSync('CREATE_TAG', id);
  },
  //选择权限
  selectPriverHandler: function (e) {
    var id = parseInt(e.detail.value);
    this.setData({
      CURRENT_PRIVER: PRIVERS[id]
    });
    wx.setStorageSync('CREATE_PRIVER', id)
  },

  //发布
  submitHandler: function () {
    var { time, TITLE, CONTENT, CURRENT_PRIVER, current_tag, UPLOADEDIMAGE, COUNT} = this.data;
    var addelment = { time, TITLE, CONTENT, CURRENT_PRIVER, current_tag ,UPLOADEDIMAGE, COUNT};
    if (!TITLE || !CONTENT) return TOAST.warning('写点什么再发布吧！');
    var list=this.data.datas;
    list.push(addelment);
    this.setData({
      datas:list,
    })
    TOAST.success('日记发布成功！');
    wx.setStorageSync('CREATE_TITLE', '');
    wx.setStorageSync('CREATE_CONTENT', '');
    wx.setStorageSync('CREATE_COUNT', 3);
    wx.setStorageSync('CREATE_UPLOADEDIMAGE', []);
    wx.setStorageSync('userData', this.data.datas);
    var model = JSON.stringify(this.data.datas)
    wx.navigateTo({
      url: '/pages/home/index?model=' + model,
    })
    
    
  },
  // 输入内容
  inputContentHandler: function (e) {
    var { value } = e.detail;
    this.setData({
      CONTENT: value
    });
    wx.setStorageSync('CREATE_CONTENT', value);
  },
  // 输入标题
  inputTitleHandler: function (e) {
    var { value } = e.detail;
    this.setData({
      TITLE: value
    });
    wx.setStorageSync('CREATE_TITLE', value);
  },
  /**
   * 上传图片
   */
  // uploadImage: function () {
  //   wx.chooseImage({
  //     count: 1,
  //     success: (res) => {
  //       wx.showLoading({
  //         title: '上传图片中..',
  //         mask: true
  //       });
  //       var filePath = res.tempFilePaths[0];
  //       API.uploadFile(filePath).then(img_url => {
  //         // 插入图片
  //         var CONTENT = this.data.CONTENT + '\n\n![](' + img_url + ')\n\n';
  //         this.setData({
  //           CONTENT,
  //           content_focus: true
  //         });
  //         // 存储缓存
  //         wx.setStorageSync('CREATE_CONTENT', CONTENT);
  //         wx.hideLoading();
  //       })
  //     },
  //   })
  // }
  uploadImage: function () {
    var that = this;
    if (that.data.COUNT == 0) return TOAST.warning('最多只能选择三张图片哦！');
    wx.chooseImage({
      count: that.data.COUNT,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        wx.showToast({
          title: '上传图片中..',
          icon: 'loading',
          duration: 500,
          mask: true
        });
        that.setData({
          IMAGE: res.tempFilePaths,
          COUNT: that.data.COUNT - res.tempFilePaths.length
        })
        that.setData({
          UPLOADEDIMAGE: that.data.UPLOADEDIMAGE.concat(res.tempFilePaths)
        })
        // 存储缓存
        wx.setStorageSync('CREATE_UPLOADEDIMAGE', that.data.UPLOADEDIMAGE);
        wx.setStorageSync('CREATE_COUNT', that.data.COUNT);
      },
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.UPLOADEDIMAGE
    })
  },
  deleteImg: function (e) {
    var that = this;
    var imgs = that.data.UPLOADEDIMAGE;
    var index = e.currentTarget.dataset.index//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('确认');
          imgs.splice(index, 1);
        } else if (res.cancel) {
          console.log('取消');
          return false;
        }
        that.setData({
          UPLOADEDIMAGE: imgs,
          COUNT: that.data.COUNT + 1
        });
        // 存储缓存
        wx.setStorageSync('CREATE_UPLOADEDIMAGE', that.data.UPLOADEDIMAGE);
        wx.setStorageSync('CREATE_COUNT', that.data.COUNT);
        console.log(that.data.COUNT);
      }
    })
  }
})