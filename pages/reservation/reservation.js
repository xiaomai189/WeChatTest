// pages/reservation/reservation.js
Page({
  data: {
    reservationType: 'in', // 预约类型：in-入库，out-出库
    selectedCar: null,
    selectedDate: '',
    minDate: '',
    maxDate: '',
    timeSlots: [],
    remark: '',
    remarkLength: 0,
    canSubmit: false
  },

  onLoad(options) {
    // 设置预约类型
    if (options.type) {
      this.setData({
        reservationType: options.type
      })
    }

    // 设置日期范围
    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 7) // 最多预约7天后

    this.setData({
      minDate: this.formatDate(today),
      maxDate: this.formatDate(maxDate)
    })

    // 初始化时间段
    this.initTimeSlots()
  },

  // 切换预约类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      reservationType: type
    })
    this.checkSubmitStatus()
  },

  // 选择车辆
  selectCar() {
    wx.navigateTo({
      url: '/pages/carManage/carManage?mode=select'
    })
  },

  // 日期选择改变
  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    })
    this.initTimeSlots() // 重新初始化时间段
    this.checkSubmitStatus()
  },

  // 选择时间段
  selectTimeSlot(e) {
    const index = e.currentTarget.dataset.index
    const timeSlots = this.data.timeSlots
    
    if (timeSlots[index].disabled) return

    // 清除其他选中状态
    timeSlots.forEach(slot => slot.selected = false)
    timeSlots[index].selected = true

    this.setData({
      timeSlots
    })
    this.checkSubmitStatus()
  },

  // 备注输入
  onRemarkInput(e) {
    const value = e.detail.value
    this.setData({
      remark: value,
      remarkLength: value.length
    })
  },

  // 初始化时间段
  initTimeSlots() {
    // 模拟时间段数据
    const slots = []
    for (let i = 8; i <= 20; i++) {
      const hour = i.toString().padStart(2, '0')
      slots.push({
        time: `${hour}:00`,
        disabled: Math.random() > 0.7, // 随机设置某些时段已约满
        selected: false
      })
      slots.push({
        time: `${hour}:30`,
        disabled: Math.random() > 0.7,
        selected: false
      })
    }
    this.setData({
      timeSlots: slots
    })
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const { selectedCar, selectedDate, timeSlots } = this.data
    const hasSelectedTime = timeSlots.some(slot => slot.selected)
    
    this.setData({
      canSubmit: selectedCar && selectedDate && hasSelectedTime
    })
  },

  // 提交预约
  submitReservation() {
    const { reservationType, selectedCar, selectedDate, timeSlots, remark } = this.data
    const selectedTime = timeSlots.find(slot => slot.selected)

    if (!this.data.canSubmit) return

    const reservation = {
      type: reservationType,
      carId: selectedCar.id,
      plateNumber: selectedCar.plateNumber,
      date: selectedDate,
      time: selectedTime.time,
      remark: remark,
      status: 'pending'
    }

    // TODO: 调用预约API
    console.log('提交预约:', reservation)

    wx.showLoading({
      title: '提交中...'
    })

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 延迟返回，让用户看到成功提示
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      })
    }, 1500)
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})