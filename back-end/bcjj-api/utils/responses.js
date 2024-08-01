/**
 * @param {any} res
 * @param {any} message
 * @param {any} data
 * @returns  {any}
 * @description   请求成功返回
 */
function successResponse(res, message, data) {
  res.json({
    message,
    status: true,
    data,
  });
}

/**
 * @param {any} res
 * @param {any} error
 * @returns {any}
 * @description   请求失败返回
 */
function failureResponse(res, error) {
  if (error.name === "SequelizeValidationError") {
    const errors = error.errors.map((e) => e.message);
    return res.status(400).json({
      message: "请求参数错误",
      status: false,
      error: errors,
    });
  }
  if (error.name === "BadRequestError") {
    return res.status(400).json({
      message: "错误的请求",
      status: false,
      error: [error.message],
    });
  }
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "认证失败",
      status: false,
      error: [error.message],
    });
  }
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "认证失败",
      status: false,
      error: ["您提交的token无效，请重新登录。"],
    });
  }
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "认证失败",
      status: false,
      error: ["您提交的token已过期，请重新登录。"],
    });
  }
  if (error.name === "NotFoundError") {
    return res.status(404).json({
      message: "资源不存在",
      status: false,
      error: [error.message],
    });
  }
  return res.status(500).json({
    message: "服务器错误",
    status: false,
    error: [error.message],
  });
}

module.exports = { successResponse, failureResponse };
