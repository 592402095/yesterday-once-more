// pages/detail/index.js
var app = getApp();
var WxParse = require('../../libs/wxParse/wxParse.js');
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');
var INFO = wx.getSystemInfoSync();
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
      COUNT:data[ID].COUNT,
      UPLOADEDIMAGE:data[ID].UPLOADEDIMAGE
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
    
    wx.showModal({
      title: '删除回忆',
      content: '确定删了这份回忆吗？',
      success: ret => {
        if (!ret.confirm) return;
        var newdata=this.data.datas;
        var ID=this.data.id;
        newdata.splice(ID,1)
        this.setData({
          datas:newdata
        })
        wx.setStorageSync('userData', '');
        wx.setStorageSync('userData', this.data.datas);
        wx.navigateBack({});
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.UPLOADEDIMAGE
    })
  }
})