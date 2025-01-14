Page({
  data: {
    currentType: '', // 当前选中的反馈类型
    content: '', // 反馈内容
    contentLength: 0, // 反馈内容长度
    images: [], // 上传的图片列表
    contact: '', // 联系方式
    canSubmit: false // 是否可以提交
  },

  // 切换反馈类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type
    })
    this.checkSubmitStatus()
  },

  // 反馈内容输入
  onContentInput(e) {
    const content = e.detail.value
    this.setData({
      content,
      contentLength: content.length
    })
    this.checkSubmitStatus()
  },

  // 选择图片
  chooseImage() {
    const remainCount = 4 - this.data.images.length
    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 上传图片到服务器
        this.uploadImages(res.tempFilePaths)
      }
    })
  },

  // 上传图片
  uploadImages(tempFilePaths) {
    wx.showLoading({
      title: '上传中...',
      mask: true
    })

    // TODO: 调用上传图片API
    setTimeout(() => {
      this.setData({
        images: [...this.data.images, ...tempFilePaths]
      })
      wx.hideLoading()
    }, 1000)
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: this.data.images
    })
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  // 联系方式输入
  onContactInput(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const { currentType, content } = this.data
    const canSubmit = currentType && content.trim().length >= 10

    this.setData({
      canSubmit
    })
  },

  // 提交反馈
  submitFeedback() {
    if (!this.data.canSubmit) return

    const { currentType, content, images, contact } = this.data

    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    // TODO: 调用提交反馈API
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 延迟返回上一页
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      })
    }, 1500)
  },

  onShareAppMessage() {
    return {
      title: '智慧立体车库-意见反馈',
      path: '/pages/feedback/feedback'
    }
  }
}) 