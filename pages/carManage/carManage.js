// pages/carManage/carManage.js
Page({
  data: {
    mode: '', // select: 选择模式, manage: 管理模式
    cars: [],
    showCarModal: false,
    showActionSheet: false,
    editingCar: null,
    selectedCar: null,
    carForm: {
      plateNumber: '',
      brandIndex: -1,
      model: '',
      colorIndex: -1,
      isDefault: false
    },
    carBrands: ['宝马', '奔驰', '奥迪', '大众', '丰田', '本田', '日产', '其他'],
    carColors: ['黑色', '白色', '银色', '红色', '蓝色', '灰色', '其他'],
    canSubmit: false
  },

  onLoad(options) {
    // 设置页面模式
    this.setData({
      mode: options.mode || 'manage'
    })
    this.loadCars()
  },

  // 加载车辆列表
  loadCars() {
    // 模拟加载车辆数据
    const cars = [
      {
        id: 1,
        plateNumber: '粤B12345',
        brand: '宝马',
        model: '3系',
        type: '轿车',
        color: '黑色',
        isDefault: true,
        selected: false
      },
      {
        id: 2,
        plateNumber: '粤B67890',
        brand: '奥迪',
        model: 'A4L',
        type: '轿车',
        color: '白色',
        isDefault: false,
        selected: false
      }
    ]
    this.setData({ cars })
  },

  // 显示添加车辆弹窗
  showAddCarModal() {
    this.setData({
      showCarModal: true,
      editingCar: null,
      carForm: {
        plateNumber: '',
        brandIndex: -1,
        model: '',
        colorIndex: -1,
        isDefault: false
      }
    })
  },

  // 隐藏车辆弹窗
  hideCarModal() {
    this.setData({
      showCarModal: false,
      editingCar: null
    })
  },

  // 显示车辆操作菜单
  showCarActions(e) {
    const car = e.currentTarget.dataset.car
    this.setData({
      showActionSheet: true,
      selectedCar: car
    })
  },

  // 隐藏车辆操作菜单
  hideActionSheet() {
    this.setData({
      showActionSheet: false,
      selectedCar: null
    })
  },

  // 编辑车辆
  editCar() {
    const car = this.data.selectedCar
    const brandIndex = this.data.carBrands.findIndex(brand => brand === car.brand)
    const colorIndex = this.data.carColors.findIndex(color => color === car.color)

    this.setData({
      showActionSheet: false,
      showCarModal: true,
      editingCar: car,
      carForm: {
        plateNumber: car.plateNumber,
        brandIndex,
        model: car.model,
        colorIndex,
        isDefault: car.isDefault
      }
    })
  },

  // 设置默认车辆
  setDefaultCar() {
    const cars = this.data.cars.map(car => ({
      ...car,
      isDefault: car.id === this.data.selectedCar.id
    }))

    this.setData({
      cars,
      showActionSheet: false
    })

    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })
  },

  // 删除车辆
  deleteCar() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该车辆吗？',
      success: (res) => {
        if (res.confirm) {
          const cars = this.data.cars.filter(car => car.id !== this.data.selectedCar.id)
          this.setData({
            cars,
            showActionSheet: false
          })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 选择车辆（选择模式）
  selectCar(e) {
    if (this.data.mode !== 'select') return

    const car = e.currentTarget.dataset.car
    const cars = this.data.cars.map(item => ({
      ...item,
      selected: item.id === car.id
    }))

    this.setData({ cars })

    // 返回选中的车辆
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.setData({
      selectedCar: car
    })

    wx.navigateBack()
  },

  // 车牌号输入
  onPlateNumberInput(e) {
    this.setData({
      'carForm.plateNumber': e.detail.value
    })
    this.checkFormValid()
  },

  // 品牌选择
  onBrandChange(e) {
    this.setData({
      'carForm.brandIndex': parseInt(e.detail.value)
    })
    this.checkFormValid()
  },

  // 车型输入
  onModelInput(e) {
    this.setData({
      'carForm.model': e.detail.value
    })
    this.checkFormValid()
  },

  // 颜色选择
  onColorChange(e) {
    this.setData({
      'carForm.colorIndex': parseInt(e.detail.value)
    })
    this.checkFormValid()
  },

  // 默认车辆切换
  onDefaultChange(e) {
    this.setData({
      'carForm.isDefault': e.detail.value
    })
  },

  // 检查表单是否有效
  checkFormValid() {
    const { plateNumber, brandIndex, model, colorIndex } = this.data.carForm
    const canSubmit = plateNumber && brandIndex > -1 && model && colorIndex > -1

    this.setData({ canSubmit })
  },

  // 提交车辆表单
  submitCarForm() {
    if (!this.data.canSubmit) return

    const { plateNumber, brandIndex, model, colorIndex, isDefault } = this.data.carForm
    const newCar = {
      id: this.data.editingCar ? this.data.editingCar.id : Date.now(),
      plateNumber,
      brand: this.data.carBrands[brandIndex],
      model,
      type: '轿车', // 可以添加车型选择
      color: this.data.carColors[colorIndex],
      isDefault,
      selected: false
    }

    let cars = []
    if (this.data.editingCar) {
      // 编辑模式
      cars = this.data.cars.map(car => {
        if (car.id === newCar.id) {
          return newCar
        }
        return {
          ...car,
          isDefault: isDefault ? false : car.isDefault
        }
      })
    } else {
      // 添加模式
      cars = [
        ...this.data.cars.map(car => ({
          ...car,
          isDefault: isDefault ? false : car.isDefault
        })),
        newCar
      ]
    }

    this.setData({
      cars,
      showCarModal: false
    })

    wx.showToast({
      title: this.data.editingCar ? '修改成功' : '添加成功',
      icon: 'success'
    })
  }
})