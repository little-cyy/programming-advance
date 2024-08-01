const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 获取分类列表
 * GET /admin/categories
 */
router.get("/", async function (req, res) {
  try {
    let { name, currentPage, paegSize } = req.query;
    currentPage = Math.abs(currentPage) || 1; //当前页码
    paegSize = Math.abs(paegSize) || 10; //每页显示多少条数据
    let condition = {
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],
      offset: (currentPage - 1) * paegSize,
      limit: paegSize,
    };
    if (name) {
      //实现模糊查询分类名字
      condition.where = {
        name: {
          [Op.like]: `%${name}%`,
        },
      };
    }
    //findAndCountAll 方法同时查询数据总数和分页数据
    const { count, rows } = await Category.findAndCountAll(condition);
    successResponse(res, "查询分类列表成功。", {
      categories: rows,
      pagination: { currentPage, paegSize, total: count },
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 分类详情：
 * GET /admin/category/{id}
 */
router.get("/:id", async function (req, res) {
  try {
    const category = await getCategories(req);
    successResponse(res, "查询分类详情成功。", category);
  } catch (error) {
    failureResponse(res, error);
  }
});
/**
 * 创建分类
 * POST /admin/categories
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    const category = await Category.create(body);
    successResponse(res, "创建分类成功。", category);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 删除分类
 * DELETE /admin/categories/{id}
 */
router.delete("/:id", async function (req, res) {
  try {
    const category = await getCategories(req);
    if (category.courses.length > 0) {
      throw new Error("该分类下有课程，无法删除。");
    }
    await category.destroy();
    successResponse(res, "删除分类成功。");
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新分类
 * PUT /admin/categories/{id}
 */
router.put("/:id", async function (req, res) {
  try {
    const category = await getCategories(req);
    const body = filterBody(req);
    await category.update(body);
    successResponse(res, "更新分类成功。", category);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * @param {Request} req
 * @returns   {Object}
 * @description  获取分类
 */
async function getCategories(req) {
  const { id } = req.params;
  const condition = {
    include: [{ model: Course, as: "courses", attributes: ["id", "name"] }],
  };
  const category = await Category.findByPk(id, condition);
  if (!category) {
    throw new NotFoundError(`ID:${id}的分类未找到。`);
  }
  return category;
}

/**
 * @param {Request} req
 * @returns   {Object}
 * @description  过滤请求体
 */
function filterBody(req) {
  const { name, rank } = req.body;
  return { name, rank };
}
