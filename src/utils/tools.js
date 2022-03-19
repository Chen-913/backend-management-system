// 工具库函数
const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export function formatDate(timestamp) {
  const timeObj = new Date(timestamp);
  // 获取年月日及星期，不足10的补0
  const year = timeObj.getFullYear().toString().padStart(2, '0');
  const month = (timeObj.getMonth() + 1).toString().padStart(2, '0');
  const day = timeObj.getDate().toString().padStart(2, '0');
  const week = weekList[timeObj.getDay()];

  const hour = timeObj.getHours().toString().padStart(2, '0');
  const minutes = timeObj.getMinutes().toString().padStart(2, '0');
  const seconds = timeObj.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`;
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
export function debounce(func, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 函数节流
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
export function throttle(func, delay = 300) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      func.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
}
