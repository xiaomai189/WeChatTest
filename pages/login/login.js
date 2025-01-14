// pages/login/login.js
Page({
  data: {
    loginType: 'password', // password: 密码登录, verify: 验证码登录
    phone: '',
    password: '',
    verifyCode: '',
    countDown: 0,
    canSendCode: false,
    canLogin: false,
    agreed: false
  },

  onLoad() {
    // 检查是否有保存的手机号
    const phone = wx.getStorageSync('lastPhone')
    if (phone) {
      this.setData({
        phone
      })
      this.checkPhone(phone)
    }
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value
    this.setData({
      phone
    })
    this.checkPhone(phone)
    this.checkLoginStatus()
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
    this.checkLoginStatus()
  },

  // 验证码输入
  onVerifyCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    })
    this.checkLoginStatus()
  },

  // 切换登录方式
  switchLoginType() {
    this.setData({
      loginType: this.data.loginType === 'password' ? 'verify' : 'password',
      password: '',
      verifyCode: ''
    })
    this.checkLoginStatus()
  },

  // 发送验证码
  sendVerifyCode() {
    if (!this.data.canSendCode || this.data.countDown > 0) return

    // TODO: 调用发送验证码API
    wx.showLoading({
      title: '发送中...'
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      })

      // 开始倒计时
      this.setData({
        countDown: 60
      })

      this.startCountDown()
    }, 1000)
  },

  // 倒计时
  startCountDown() {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer)
    }

    this.countDownTimer = setInterval(() => {
      if (this.data.countDown <= 1) {
        clearInterval(this.countDownTimer)
        this.setData({
          countDown: 0
        })
        return
      }

      this.setData({
        countDown: this.data.countDown - 1
      })
    }, 1000)
  },

  // 检查手机号
  checkPhone(phone) {
    const phoneReg = /^1[3-9]\d{9}$/
    const canSendCode = phoneReg.test(phone)
    this.setData({
      canSendCode
    })
  },

  // 检查登录状态
  checkLoginStatus() {
    const { loginType, phone, password, verifyCode, agreed } = this.data
    let canLogin = false

    if (loginType === 'password') {
      canLogin = phone && password && agreed
    } else {
      canLogin = phone && verifyCode && agreed
    }

    this.setData({
      canLogin
    })
  },

  // 协议勾选
  onAgreementChange(e) {
    this.setData({
      agreed: e.detail.value.length > 0
    })
    this.checkLoginStatus()
  },

  // 查看用户协议
  viewUserAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    })
  },

  // 查看隐私政策
  viewPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=privacy'
    })
  },

  // 处理登录
  handleLogin() {
    if (!this.data.canLogin) return

    const { loginType, phone, password, verifyCode } = this.data

    wx.showLoading({
      title: '登录中...'
    })

    // TODO: 调用登录API
    setTimeout(() => {
      // 模拟登录成功
      wx.setStorageSync('token', 'mock_token')
      wx.setStorageSync('lastPhone', phone)

      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 延迟返回，让用户看到成功提示
          setTimeout(() => {
            const pages = getCurrentPages()
            if (pages.length > 1) {
              wx.navigateBack()
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }, 1500)
        }
      })
    }, 1500)
  },

  // 获取微信手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...'
    })

    // TODO: 调用微信登录API，使用e.detail.code换取手机号
    setTimeout(() => {
      // 模拟登录成功
      const mockPhone = '13800138000'
      wx.setStorageSync('token', 'mock_token')
      wx.setStorageSync('lastPhone', mockPhone)

      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            const pages = getCurrentPages()
            if (pages.length > 1) {
              wx.navigateBack()
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }, 1500)
        }
      })
    }, 1500)
  },

  onUnload() {
    // 清除倒计时
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer)
    }
  }
})