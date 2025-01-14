import { http } from '../utils/request';

// 停车场相关接口
export const parkingApi = {
  /**
   * 获取停车场状态
   * @param {string} parkingLotId 停车场ID
   */
  getParkingStatus(parkingLotId) {
    return http.get('/parking/status', {
      parkingLotId
    });
  },

  /**
   * 获取预约记录列表
   * @param {Object} params 查询参数
   * @param {number} params.pageNum 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.status 状态
   */
  getReservationList(params) {
    return http.get('/parking/reservation/list', params);
  },

  /**
   * 创建预约
   * @param {Object} data 预约信息
   * @param {string} data.carId 车辆ID
   * @param {string} data.parkingLotId 停车场ID
   * @param {string} data.date 日期
   * @param {string} data.timeSlot 时间段
   * @param {string} data.type 预约类型（入库/出库）
   */
  createReservation(data) {
    return http.post('/parking/reservation/create', data);
  },

  /**
   * 取消预约
   * @param {string} reservationId 预约ID
   */
  cancelReservation(reservationId) {
    return http.post('/parking/reservation/cancel', {
      reservationId
    });
  },

  /**
   * 获取可用时间段
   * @param {string} date 日期
   * @param {string} parkingLotId 停车场ID
   */
  getAvailableTimeSlots(date, parkingLotId) {
    return http.get('/parking/timeslots', {
      date,
      parkingLotId
    });
  },

  /**
   * 获取停车费用
   * @param {string} carId 车辆ID
   * @param {string} parkingLotId 停车场ID
   */
  getParkingFee(carId, parkingLotId) {
    return http.get('/parking/fee', {
      carId,
      parkingLotId
    });
  }
}; 