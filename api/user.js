import { http } from '../utils/request';
import { md5 } from '../utils/crypto';

// 用户相关接口
export const userApi = {
  /**
   * 密码登录
   * @param {string} phone 手机号
   * @param {string} password 密码
   */
  loginWithPassword(phone, password) {
    return http.post('/user/login/password', {
      phone,
      password: md5(password)
    });
  },

  /**
   * 验证码登录
   * @param {string} phone 手机号
   * @param {string} code 验证码
   */
  loginWithCode(phone, code) {
    return http.post('/user/login/code', {
      phone,
      code
    });
  },

  /**
   * 发送验证码
   * @param {string} phone 手机号
   */
  sendVerifyCode(phone) {
    return http.post('/sms/send', {
      phone
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return http.get('/user/info');
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户信息
   */
  updateUserInfo(data) {
    return http.put('/user/info', data);
  },

  /**
   * 退出登录
   */
  logout() {
    return http.post('/user/logout');
  }
}; 