const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 获取文章列表
 * GET /admin/articles
 */
router.get("/", async function (req, res) {
  try {
    let { title, currentPage, paegSize } = req.query;
    currentPage = Math.abs(currentPage) || 1; //当前页码
    paegSize = Math.abs(paegSize) || 10; //每页显示多少条数据
    let condition = {
      order: [["id", "DESC"]],
      offset: (currentPage - 1) * paegSize,
      limit: paegSize,
    };
    if (title) {
      //实现模糊查询文章标题
      condition.where = {
        title: {
          [Op.like]: `%${title}%`,
        },
      };
    }
    //findAndCountAll 方法同时查询数据总数和分页数据
    const { count, rows } = await Article.findAndCountAll(condition);
    successResponse(res, "查询文章列表成功。", {
      articles: rows,
      pagination: { currentPage, paegSize, total: count },
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 文章详情：
 * GET /admin/article/{id}
 */
router.get("/:id", async function (req, res) {
  try {
    const article = await getArticles(req);
    successResponse(res, "查询文章详情成功。", article);
  } catch (error) {
    failureResponse(res, error);
  }
});
/**
 * 创建文章
 * POST /admin/articles
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    const article = await Article.create(body);
    successResponse(res, "创建文章成功。", article);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 删除文章
 * DELETE /admin/articles/{id}
 */
router.delete("/:id", async function (req, res) {
  try {
    const article = await getArticles(req);
    await article.destroy();
    successResponse(res, "删除文章成功。");
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新文章
 * PUT /admin/articles/{id}
 */
router.put("/:id", async function (req, res) {
  try {
    const article = await getArticles(req);
    const body = filterBody(req);
    await article.update(body);
    successResponse(res, "更新文章成功。", article);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * @param {Request} req
 * @returns   {Article}
 * @description  获取文章
 */
async function getArticles(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError(`ID:${id}的文章未找到。`);
  }
  return article;
}

/**
 * @param {Request} req
 * @returns   {Object}
 * @description  过滤请求体
 */
function filterBody(req) {
  const { title, content } = req.body;
  return { title, content };
}
