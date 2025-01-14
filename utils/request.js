// utils/request.js

const BASE_URL = 'https://api.example.com'; // 替换为实际的API地址
const DEFAULT_TIMEOUT = 10000; // 10秒超时

// 请求队列，用于断网重连后重试
let requestQueue = [];
// 是否正在重试
let isRetrying = false;

const request = {
  /**
   * 发起请求
   * @param {Object} options 请求配置
   * @returns {Promise}
   */
  async send(options) {
    // 合并默认配置
    const config = {
      timeout: DEFAULT_TIMEOUT,
      ...options,
      url: `${BASE_URL}${options.url}`,
    };

    try {
      // 请求拦截
      const interceptedConfig = await this.beforeRequest(config);
      // 发起请求
      const response = await this.wxRequest(interceptedConfig);
      // 响应拦截
      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error, config);
    }
  },

  /**
   * 请求拦截器
   * @param {Object} config 请求配置
   * @returns {Object}
   */
  async beforeRequest(config) {
    // 添加token
    const token = wx.getStorageSync('token');
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      };
    }

    // 添加时间戳防止缓存
    if (config.method.toUpperCase() === 'GET') {
      config.data = {
        ...config.data,
        _t: Date.now()
      };
    }

    return config;
  },

  /**
   * 响应拦截器
   * @param {Object} response 响应数据
   * @returns {Object}
   */
  async handleResponse(response) {
    const { statusCode, data } = response;
    
    // HTTP状态码处理
    if (statusCode !== 200) {
      throw new Error(`HTTP错误: ${statusCode}`);
    }

    // 业务状态码处理
    const { code, message, data: responseData } = data;
    
    switch (code) {
      case 0: // 成功
        return responseData;
      case 401: // token失效
        await this.handleTokenExpired();
        throw new Error('登录已过期');
      case 403: // 权限不足
        throw new Error('没有权限');
      default:
        throw new Error(message || '请求失败');
    }
  },

  /**
   * 统一错误处理
   * @param {Error} error 错误对象
   * @param {Object} config 请求配置
   * @returns {Promise}
   */
  async handleError(error, config) {
    // 断网处理
    if (error.errMsg && error.errMsg.includes('request:fail')) {
      await this.handleNetworkError(config);
      return;
    }

    // 显示错误提示
    wx.showToast({
      title: error.message || '网络错误',
      icon: 'none',
      duration: 2000
    });

    return Promise.reject(error);
  },

  /**
   * 处理token过期
   */
  async handleTokenExpired() {
    // 清除登录信息
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');

    // 跳转到登录页
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage.route !== 'pages/login/login') {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  /**
   * 处理断网情况
   * @param {Object} config 请求配置
   */
  async handleNetworkError(config) {
    // 将请求添加到队列
    requestQueue.push(config);

    // 如果已经在重试中，直接返回
    if (isRetrying) return;

    // 显示网络错误提示
    wx.showToast({
      title: '网络连接失败，请检查网络设置',
      icon: 'none',
      duration: 2000
    });

    // 监听网络状态
    this.startNetworkListener();
  },

  /**
   * 监听网络状态
   */
  startNetworkListener() {
    isRetrying = true;
    wx.onNetworkStatusChange(async (res) => {
      if (res.isConnected && requestQueue.length > 0) {
        // 网络恢复后重试队列中的请求
        const requests = [...requestQueue];
        requestQueue = [];
        
        try {
          await Promise.all(requests.map(config => this.send(config)));
          wx.showToast({
            title: '网络已恢复',
            icon: 'success',
            duration: 2000
          });
        } catch (error) {
          console.error('重试请求失败:', error);
        }
      }
      isRetrying = false;
    });
  },

  /**
   * 封装wx.request
   * @param {Object} config 请求配置
   * @returns {Promise}
   */
  wxRequest(config) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...config,
        success: resolve,
        fail: reject
      });
    });
  }
};

// 导出请求方法
export const http = {
  get: (url, data, options = {}) => {
    return request.send({
      method: 'GET',
      url,
      data,
      ...options
    });
  },
  post: (url, data, options = {}) => {
    return request.send({
      method: 'POST',
      url,
      data,
      ...options
    });
  },
  put: (url, data, options = {}) => {
    return request.send({
      method: 'PUT',
      url,
      data,
      ...options
    });
  },
  delete: (url, data, options = {}) => {
    return request.send({
      method: 'DELETE',
      url,
      data,
      ...options
    });
  }
}; 