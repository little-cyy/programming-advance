const express = require("express");
const router = express.Router();
const { Chapter, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, BadRequestError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 获取章节列表
 * GET /admin/chapters
 */
router.get("/", async function (req, res) {
  try {
    let { courseId, title, rank, currentPage, paegSize } = req.query;
    currentPage = Math.abs(currentPage) || 1; //当前页码
    paegSize = Math.abs(paegSize) || 10; //每页显示多少条数据
    let condition = {
      ...getCondition(),
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],
      offset: (currentPage - 1) * paegSize,
      limit: paegSize,
      where: {},
    };
    if (!courseId) {
      throw new BadRequestError("获取章节列表失败,课程id不能为空");
    }
    // 构建查询条件
    if (courseId) {
      condition.where.courseId = {
        [Op.eq]: courseId,
      };
    }
    if (title) {
      condition.where.title = {
        [Op.like]: `%${title}%`,
      };
    }
    if (rank) {
      condition.where.rank = {
        [Op.eq]: rank,
      };
    }

    //findAndCountAll 方法同时查询数据总数和分页数据
    const { count, rows } = await Chapter.findAndCountAll(condition);
    successResponse(res, "查询章节列表成功。", {
      chapters: rows,
      pagination: { currentPage, paegSize, total: count },
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 章节详情：
 * GET /admin/chapter/{id}
 */
router.get("/:id", async function (req, res) {
  try {
    const chapter = await getChapters(req);
    successResponse(res, "查询章节详情成功。", chapter);
  } catch (error) {
    failureResponse(res, error);
  }
});
/**
 * 创建章节
 * POST /admin/chapters
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    const chapter = await Chapter.create(body);
    successResponse(res, "创建章节成功。", chapter);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 删除章节
 * DELETE /admin/chapters/{id}
 */
router.delete("/:id", async function (req, res) {
  try {
    const chapter = await getChapters(req);
    await chapter.destroy();
    successResponse(res, "删除章节成功。");
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新章节
 * PUT /admin/chapters/{id}
 */
router.put("/:id", async function (req, res) {
  try {
    const chapter = await getChapters(req);
    const body = filterBody(req);
    await chapter.update(body);
    successResponse(res, "更新章节成功。", chapter);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * @param {Request} req
 * @returns   {Chapter}
 * @description  获取章节
 */
async function getChapters(req) {
  const { id } = req.params;
  const condition = getCondition();
  const chapter = await Chapter.findByPk(id, condition);
  if (!chapter) {
    throw new NotFoundError(`ID:${id}的章节未找到。`);
  }
  return chapter;
}

/**
 * @returns   {object}
 * @description   获取查询公共条件
 */
function getCondition() {
  return {
    attributes: { exclude: ["CourseId"] },
    include: [
      { model: Course, as: "course", attributes: ["id", "name"] }, // 关联课程
    ],
  };
}
/**
 * @param {Request} req
 * @returns   {Object}
 * @description  过滤请求体
 */
function filterBody(req) {
  const { courseId, title, content, rank, video } = req.body;
  return {
    courseId,
    title,
    content,
    rank,
    video,
  };
}
