const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 获取用户列表
 * GET /admin/users
 */
router.get("/", async function (req, res) {
  try {
    let { email, username, nickname, role, currentPage, paegSize } = req.query;
    currentPage = Math.abs(currentPage) || 1; //当前页码
    paegSize = Math.abs(paegSize) || 10; //每页显示多少条数据
    let condition = {
      order: [["id", "DESC"]],
      offset: (currentPage - 1) * paegSize,
      limit: paegSize,
      where: {},
    };

    // 构建查询条件
    if (email) {
      condition.where.email = {
        [Op.eq]: email,
      };
    }
    if (username) {
      condition.where.username = {
        [Op.eq]: username,
      };
    }
    if (nickname) {
      condition.where.nickname = {
        [Op.like]: `%${nickname}%`,
      };
    }
    if (role) {
      condition.where.role = {
        [Op.eq]: role,
      };
    }
    //findAndCountAll 方法同时查询数据总数和分页数据
    const { count, rows } = await User.findAndCountAll(condition);
    successResponse(res, "查询用户列表成功。", {
      users: rows,
      pagination: { currentPage, paegSize, total: count },
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 用户详情：
 * GET /admin/user/{id}
 */
router.get("/:id", async function (req, res) {
  try {
    const user = await getUsers(req);
    successResponse(res, "查询用户详情成功。", user);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/users
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    const user = await User.create(body);
    successResponse(res, "创建用户成功。", user);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新用户
 * PUT /admin/users/{id}
 */
router.put("/:id", async function (req, res) {
  try {
    const user = await getUsers(req);
    const body = filterBody(req);
    await user.update(body);
    successResponse(res, "更新用户成功。", user);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * @param {Request} req
 * @returns   {User}
 * @description  获取用户
 */
async function getUsers(req) {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError(`ID:${id}的用户未找到。`);
  }
  return user;
}

/**
 * @param {Request} req
 * @returns   {Object}
 * @description  过滤请求体
 */
function filterBody(req) {
  const {
    email,
    username,
    password,
    nickname,
    sex,
    compony,
    introduce,
    role,
    avatar,
  } = req.body;
  return {
    email,
    username,
    password,
    nickname,
    sex,
    compony,
    introduce,
    role,
    avatar,
  };
}
