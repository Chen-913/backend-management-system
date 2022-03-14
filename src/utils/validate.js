/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证账号是否合法
 * @param {string} str 账号
 * @returns {Boolean}
 */
export function validUsername(usernameStr) {
  const usernameReg = /^[a-zA-Z0-9_]{3,15}$/;
  return usernameReg.test(usernameStr);
}

/**
 * 验证密码是否合法
 * @param {String} pwdStr 密码
 * @returns {Boolean}
 */
export function validPassword(pwdStr) {
  const pwdReg = /^[a-zA-Z0-9]{6,15}$/;
  return pwdReg.test(pwdStr);
}

/**
 * 验证输入的验证码是否合法
 * @param {String} captchaStr 验证码
 * @returns {Boolean}
 */
export function validCaptcha(captchaStr) {
  const captchaReg = /^[a-zA-Z0-9]{4}$/;
  return captchaReg.test(captchaStr);
}
