const express = require("express");
const router = express.Router();
const { Setting } = require("../../models");
const { NotFoundError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 设置详情：
 * GET /admin/setting
 */
router.get("/", async function (req, res) {
  try {
    const setting = await getSettings();
    successResponse(res, "查询设置详情成功。", setting);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新设置
 * PUT /admin/settings
 */
router.put("/", async function (req, res) {
  try {
    const setting = await getSettings();
    await setting.update(req.body);
    successResponse(res, "更新设置成功。", setting);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * 公共方法：查询当前设置
 
 */
async function getSettings() {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFoundError(`初始设置未找到，请运行种子文件。`);
  }
  return setting;
}
