const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NotFoundError, BadRequestError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 管理员登录
 * @route POST /admin/auth/sign_in
 */
router.post("/sign_in", async (req, res, next) => {
  try {
    const { login, password } = req.body;
    if (!login) {
      throw new BadRequestError("用户名不能为空");
    }
    if (!password) {
      throw new BadRequestError("密码不能为空");
    }
    const condition = {
      where: {
        [Op.or]: [{ username: login }, { email: login }],
      },
    };
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFoundError("用户不存在");
    }
    //验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("密码错误");
    }
    // 验证是否是管理员
    const isAdmin = user.role === 100;
    if (!isAdmin) {
      throw new BadRequestError("您不是管理员");
    }
    // 生成token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    successResponse(res, "登录成功", { token });
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;
