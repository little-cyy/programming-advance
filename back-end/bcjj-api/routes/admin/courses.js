const express = require("express");
const router = express.Router();
const { Course, Category, User, Chapter } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { successResponse, failureResponse } = require("../../utils/responses");

/**
 * 获取课程列表
 * GET /admin/courses
 */
router.get("/", async function (req, res) {
  try {
    let {
      categoryId,
      userId,
      name,
      recommended,
      introductory,
      currentPage,
      paegSize,
    } = req.query;
    currentPage = Math.abs(currentPage) || 1; //当前页码
    paegSize = Math.abs(paegSize) || 10; //每页显示多少条数据
    let condition = {
      ...getCondition(),
      order: [["id", "ASC"]],
      offset: (currentPage - 1) * paegSize,
      limit: paegSize,
      where: {},
    };

    // 构建查询条件
    if (categoryId) {
      condition.where.categoryId = {
        [Op.eq]: categoryId,
      };
    }
    if (userId) {
      condition.where.userId = {
        [Op.eq]: userId,
      };
    }
    if (name) {
      condition.where.name = {
        [Op.like]: `%${name}%`,
      };
    }
    if (recommended) {
      condition.where.recommended = {
        [Op.eq]: recommended === "true",
      };
    }
    if (introductory) {
      condition.where.introductory = {
        [Op.eq]: introductory === "true",
      };
    }
    //findAndCountAll 方法同时查询数据总数和分页数据
    const { count, rows } = await Course.findAndCountAll(condition);
    successResponse(res, "查询课程列表成功。", {
      courses: rows,
      pagination: { currentPage, paegSize, total: count },
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 课程详情：
 * GET /admin/course/{id}
 */
router.get("/:id", async function (req, res) {
  try {
    const course = await getCourses(req);
    successResponse(res, "查询课程详情成功。", course);
  } catch (error) {
    failureResponse(res, error);
  }
});
/**
 * 创建课程
 * POST /admin/courses
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    body.userId = req.user.id;
    const course = await Course.create(body);
    successResponse(res, "创建课程成功。", course);
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 删除课程
 * DELETE /admin/courses/{id}
 */
router.delete("/:id", async function (req, res) {
  try {
    const course = await getCourses(req);
    if (course.chapters.length > 0) {
      throw new Error("该课程下有章节，无法删除。");
    }
    await course.destroy();
    successResponse(res, "删除课程成功。");
  } catch (error) {
    failureResponse(res, error);
  }
});

/**
 * 更新课程
 * PUT /admin/courses/{id}
 */
router.put("/:id", async function (req, res) {
  try {
    const course = await getCourses(req);
    const body = filterBody(req);
    await course.update(body);
    successResponse(res, "更新课程成功。", course);
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;

/**
 * @param {Request} req
 * @returns   {Course}
 * @description  获取课程
 */
async function getCourses(req) {
  const { id } = req.params;
  const condition = getCondition();
  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError(`ID:${id}的课程未找到。`);
  }
  return course;
}

/**
 * @returns   [object]
 * @description   获取查询公共条件
 */
function getCondition() {
  return {
    attributes: { exclude: ["CategoryId", "UserId"] },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: User, as: "user", attributes: ["id", "username", "avatar"] },
      { model: Chapter, as: "chapters", attributes: ["id", "title"] },
    ],
  };
}
/**
 * @param {Request} req
 * @returns   {Object}
 * @description  过滤请求体
 */
function filterBody(req) {
  const {
    categoryId,
    userId,
    name,
    recommended,
    introductory,
    content,
    likesCount,
    chaptersCount,
  } = req.body;
  return {
    categoryId,
    userId,
    name,
    recommended,
    introductory,
    content,
    likesCount,
    chaptersCount,
  };
}
