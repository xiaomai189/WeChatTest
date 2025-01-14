// pages/parkingStatus/parkingStatus.js
Page({
  data: {
    currentFloor: 1,
    floors: [
      { floor: 1, totalSpots: 20, availableSpots: 8 },
      { floor: 2, totalSpots: 20, availableSpots: 12 },
      { floor: 3, totalSpots: 20, availableSpots: 15 }
    ],
    parkingSpots: [],
    showSpotDetail: false,
    selectedSpot: null
  },

  onLoad() {
    this.initParkingSpots()
  },

  // 初始化车位数据
  initParkingSpots() {
    // 模拟车位数据
    const spots = []
    const statuses = ['available', 'occupied', 'reserved', 'disabled']
    const totalSpots = 20

    for (let i = 1; i <= totalSpots; i++) {
      const status = statuses[Math.floor(Math.random() * 4)]
      const spot = {
        id: i,
        number: `${this.data.currentFloor}${i.toString().padStart(2, '0')}`,
        status: status,
        statusText: this.getStatusText(status)
      }

      // 根据状态添加额外信息
      if (status === 'occupied') {
        spot.plateNumber = `粤B${Math.floor(Math.random() * 90000 + 10000)}`
        spot.enterTime = this.getRandomTime()
      } else if (status === 'reserved') {
        spot.plateNumber = `粤B${Math.floor(Math.random() * 90000 + 10000)}`
        spot.reserveTime = this.getRandomTime()
      }

      spots.push(spot)
    }

    this.setData({
      parkingSpots: spots
    })
  },

  // 切换楼层
  switchFloor(e) {
    const floor = e.currentTarget.dataset.floor
    this.setData({
      currentFloor: floor
    }, () => {
      this.initParkingSpots()
    })
  },

  // 显示车位详情
  showSpotDetail(e) {
    const spot = e.currentTarget.dataset.spot
    this.setData({
      showSpotDetail: true,
      selectedSpot: spot
    })
  },

  // 隐藏车位详情
  hideSpotDetail() {
    this.setData({
      showSpotDetail: false,
      selectedSpot: null
    })
  },

  // 预约车位
  reserveSpot() {
    const spot = this.data.selectedSpot
    wx.navigateTo({
      url: `/pages/reservation/reservation?type=in&spotNumber=${spot.number}`
    })
  },

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      'available': '空闲',
      'occupied': '已占用',
      'reserved': '已预约',
      'disabled': '维护中'
    }
    return statusMap[status] || status
  },

  // 生成随机时间
  getRandomTime() {
    const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0')
    const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  onPullDownRefresh() {
    this.initParkingSpots()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage() {
    return {
      title: '智慧立体车库-实时车位状态',
      path: '/pages/parkingStatus/parkingStatus'
    }
  }
})