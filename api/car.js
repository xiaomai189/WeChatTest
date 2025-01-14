import { http } from '../utils/request';

// 车辆管理相关接口
export const carApi = {
  /**
   * 获取车辆列表
   */
  getCarList() {
    return http.get('/car/list');
  },

  /**
   * 添加车辆
   * @param {Object} data 车辆信息
   * @param {string} data.plateNumber 车牌号
   * @param {string} data.brand 品牌
   * @param {string} data.model 型号
   * @param {string} data.color 颜色
   * @param {boolean} data.isDefault 是否默认
   */
  addCar(data) {
    return http.post('/car/add', data);
  },

  /**
   * 更新车辆信息
   * @param {string} carId 车辆ID
   * @param {Object} data 车辆信息
   */
  updateCar(carId, data) {
    return http.put(`/car/update/${carId}`, data);
  },

  /**
   * 删除车辆
   * @param {string} carId 车辆ID
   */
  deleteCar(carId) {
    return http.delete(`/car/delete/${carId}`);
  },

  /**
   * 设置默认车辆
   * @param {string} carId 车辆ID
   */
  setDefaultCar(carId) {
    return http.post('/car/set-default', {
      carId
    });
  },

  /**
   * 验证车牌号
   * @param {string} plateNumber 车牌号
   */
  validatePlateNumber(plateNumber) {
    return http.post('/car/validate-plate', {
      plateNumber
    });
  },

  /**
   * 获取车辆品牌列表
   */
  getCarBrands() {
    return http.get('/car/brands');
  },

  /**
   * 获取车型列表
   * @param {string} brandId 品牌ID
   */
  getCarModels(brandId) {
    return http.get('/car/models', {
      brandId
    });
  }
}; 