// pages/detail/index.js
var INFO = wx.getSystemInfoSync();
var app = getApp();
var WxParse = require('../../libs/wxParse/wxParse.js');
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = wx.getStorageSync('userData');
    var ID = options.id;
    this.setData({
      id: ID
    });
    if (data) {
      this.setData({
        datas: data
      })
    }
    this.setData({
      time: data[ID].time,
      TITLE:data[ID].TITLE,
      CONTENT:data[ID].CONTENT,
      current_tag:data[ID].current_tag,
      CURRENT_PRIVER:data[ID].CURRENT_PRIVER,
    });
    TOAST = new weToast(this);
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

  goBackHandler: function () {
    wx.navigateBack({});
  },

  // 删除
  delHandler: function () {
    var { INFO } = this.data;
    console.log(INFO.delToken);
    wx.showModal({
      title: '删除日记',
      content: '确定删了这篇日记吗？多多考虑噢！',
      success: ret => {
        if (!ret.confirm) return;
        // 开始删除
        wx.showLoading({
          title: '删除日记中',
          mask: true
        });
        API.delDairy(INFO.id, INFO.delToken).then(() => {
          wx.hideLoading();
          TOAST.success('日记删除成功！');
          // 刷新日记列表
          YUDAO.loadDairy();
          YUDAO.loadMyDairy && YUDAO.loadMyDairy();
          // 返回
          setTimeout(() => wx.navigateBack({}), 1000);
        }).catch(err => {
          TOAST.error('日记删除失败！');
          console.warn(err);
        });
      }
    })
  }
})