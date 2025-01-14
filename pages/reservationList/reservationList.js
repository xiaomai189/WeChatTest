Page({
  data: {
    currentStatus: '', // 当前筛选状态
    reservations: [], // 预约记录列表
    pageNum: 1, // 当前页码
    pageSize: 10, // 每页数量
    hasMore: true, // 是否还有更多数据
    isLoading: false // 是否正在加载
  },

  onLoad() {
    this.loadReservations()
  },

  // 切换状态筛选
  switchStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      currentStatus: status,
      reservations: [],
      pageNum: 1,
      hasMore: true
    })
    this.loadReservations()
  },

  // 加载预约记录
  loadReservations() {
    if (this.data.isLoading || !this.data.hasMore) return

    this.setData({
      isLoading: true
    })

    // TODO: 调用获取预约记录API
    setTimeout(() => {
      // 模拟API返回数据
      const mockData = this.getMockData()
      
      this.setData({
        reservations: [...this.data.reservations, ...mockData],
        pageNum: this.data.pageNum + 1,
        hasMore: mockData.length === this.data.pageSize,
        isLoading: false
      })
    }, 1000)
  },

  // 模拟数据
  getMockData() {
    const { currentStatus, pageNum, pageSize } = this.data
    const mockData = []
    
    // 只在第一页时返回数据，模拟数据加载完毕
    if (pageNum === 1) {
      for (let i = 1; i <= 5; i++) {
        const status = currentStatus || ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)]
        if (currentStatus && status !== currentStatus) continue

        mockData.push({
          id: i,
          type: Math.random() > 0.5 ? 'in' : 'out',
          plateNumber: '粤B' + (12345 + i),
          date: '2024-01-14',
          time: '14:' + (30 + i),
          spotNumber: (100 + i).toString(),
          status,
          statusText: {
            pending: '待确认',
            confirmed: '已确认',
            completed: '已完成',
            cancelled: '已取消'
          }[status],
          remark: Math.random() > 0.5 ? '临时停车' : ''
        })
      }
    }

    return mockData
  },

  // 加载更多
  loadMore() {
    this.loadReservations()
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

  onPullDownRefresh() {
    this.setData({
      reservations: [],
      pageNum: 1,
      hasMore: true
    })
    this.loadReservations()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage() {
    return {
      title: '智慧立体车库-预约记录',
      path: '/pages/reservationList/reservationList'
    }
  }
}) 