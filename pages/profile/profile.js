// pages/profile/profile.js
Page({
  data: {
    isLogin: false,
    userInfo: null,
    cars: [],
    reservations: []
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    if (this.data.isLogin) {
      this.loadUserData()
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    // TODO: 检查本地存储的登录信息
    const token = wx.getStorageSync('token')
    if (token) {
      this.setData({
        isLogin: true
      })
      this.loadUserData()
    }
  },

  // 加载用户数据
  loadUserData() {
    // 模拟加载用户信息
    this.setData({
      userInfo: {
        avatarUrl: '/images/default-avatar.png',
        nickName: '张三',
        phone: '138****8888'
      }
    })

    // 模拟加载车辆信息
    this.setData({
      cars: [
        {
          id: 1,
          plateNumber: '粤B12345',
          model: '宝马 3系'
        },
        {
          id: 2,
          plateNumber: '粤B67890',
          model: '奥迪 A4L'
        }
      ]
    })

    // 模拟加载预约记录
    this.setData({
      reservations: [
        {
          id: 1,
          type: 'in',
          plateNumber: '粤B12345',
          date: '2024-01-14',
          time: '14:30',
          spotNumber: '101',
          status: 'pending',
          statusText: '待确认'
        },
        {
          id: 2,
          type: 'out',
          plateNumber: '粤B67890',
          date: '2024-01-14',
          time: '15:00',
          spotNumber: '205',
          status: 'confirmed',
          statusText: '已确认'
        }
      ]
    })
  },

  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 查看全部预约记录
  viewAllReservations() {
    wx.navigateTo({
      url: '/pages/reservationList/reservationList'
    })
  },

  // 取消预约
  cancelReservation(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要取消该预约吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...'
          })

          // TODO: 调用取消预约API
          setTimeout(() => {
            // 模拟API调用成功
            const reservations = this.data.reservations.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  status: 'cancelled',
                  statusText: '已取消'
                }
              }
              return item
            })

            this.setData({
              reservations
            })

            wx.hideLoading()
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            })
          }, 1000)
        }
      }
    })
  },

  // 跳转到意见反馈
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },

  // 跳转到关于我们
  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          wx.removeStorageSync('token')
          this.setData({
            isLogin: false,
            userInfo: null,
            cars: [],
            reservations: []
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '智慧立体车库-便捷停车',
      path: '/pages/index/index'
    }
  }
})