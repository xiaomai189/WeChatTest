// pages/index/index.js
import { parkingApi } from '../../api/parking';
import { userApi } from '../../api/user';

Page({
  data: {
    currentTime: '',
    totalSpots: 100,
    availableSpots: 65,
    reservedSpots: 35,
    recentReservations: [],
    isLoggedIn: false
  },

  onLoad() {
    this.checkLoginStatus();
    this.updateCurrentTime();
    this.startTimeUpdate();
    this.loadParkingStatus();
    this.loadRecentReservations();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadParkingStatus();
    this.loadRecentReservations();
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadParkingStatus(),
      this.loadRecentReservations()
    ]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 检查登录状态
  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (!token) {
      this.navigateToLogin();
      return;
    }

    try {
      await userApi.getUserInfo();
      this.setData({ isLoggedIn: true });
    } catch (error) {
      this.navigateToLogin();
    }
  },

  // 更新当前时间
  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  // 启动时间更新
  startTimeUpdate() {
    // 对齐到下一分钟
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    
    setTimeout(() => {
      this.updateCurrentTime();
      // 每分钟更新一次
      setInterval(() => {
        this.updateCurrentTime();
      }, 60000);
    }, delay);
  },

  // 加载停车场状态
  async loadParkingStatus() {
    try {
      wx.showNavigationBarLoading();
      const status = await parkingApi.getParkingStatus('default_lot');
      this.setData({
        totalSpots: status.totalSpots,
        availableSpots: status.availableSpots,
        reservedSpots: status.reservedSpots
      });
    } catch (error) {
      wx.showToast({
        title: '加载状态失败',
        icon: 'none'
      });
    } finally {
      wx.hideNavigationBarLoading();
    }
  },

  // 加载最近预约记录
  async loadRecentReservations() {
    try {
      const reservations = await parkingApi.getReservationList({
        pageNum: 1,
        pageSize: 3
      });
      this.setData({
        recentReservations: reservations.list
      });
    } catch (error) {
      console.error('加载预约记录失败:', error);
    }
  },

  // 预约入库
  handleInReservation() {
    if (!this.data.isLoggedIn) {
      this.navigateToLogin();
      return;
    }
    wx.navigateTo({
      url: '/pages/reservation/reservation?type=in'
    });
  },

  // 预约出库
  handleOutReservation() {
    if (!this.data.isLoggedIn) {
      this.navigateToLogin();
      return;
    }
    wx.navigateTo({
      url: '/pages/reservation/reservation?type=out'
    });
  },

  // 查看所有预约
  viewAllReservations() {
    if (!this.data.isLoggedIn) {
      this.navigateToLogin();
      return;
    }
    wx.switchTab({
      url: '/pages/reservationList/reservationList'
    });
  },

  // 跳转到车辆管理
  navigateToCarManage() {
    if (!this.data.isLoggedIn) {
      this.navigateToLogin();
      return;
    }
    wx.navigateTo({
      url: '/pages/carManage/carManage'
    });
  },

  // 跳转到问题反馈
  navigateToFeedback() {
    if (!this.data.isLoggedIn) {
      this.navigateToLogin();
      return;
    }
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 跳转到使用指南
  navigateToGuide() {
    wx.navigateTo({
      url: '/pages/guide/guide'
    });
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
      fail: () => {
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到登录页
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  onUnload() {
    // 清理定时器
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }
});
