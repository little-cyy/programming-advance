const express = require("express");
const router = express.Router();
const { Course, User, Category } = require("../models");
const { Op, where } = require("sequelize");
const { NotFoundError } = require("../utils/errors");
const { successResponse, failureResponse } = require("../utils/responses");

/**
 * 查询首页数据
 */
router.get("/", async function (req, res, next) {
  try {
    //推荐课程
    const recommendedCourse = await Course.findAll({
      attributes: { exclude: ["CategoryId", "UserId", "content"] },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "nickname", "avatar", "company"],
        },
      ],
      where: {
        recommended: true,
      },
      order: [["id", "desc"]],
      limit: 10,
    });
    //人气课程
    const likesCourse = await Course.findAll({
      attributes: { exclude: ["CategoryId", "UserId", "content"] },
      order: [
        ["likesCount", "desc"],
        ["id", "desc"],
      ],
      limit: 10,
    });
    //入门课程
    const introductoryCourse = await Course.findAll({
      attributes: { exclude: ["CategoryId", "UserId", "content"] },
      where: {
        introductory: true,
      },
      order: [["id", "desc"]],
      limit: 10,
    });
    successResponse(res, "获取首页数据成功。", {
      recommendedCourse,
      likesCourse,
      introductoryCourse,
    });
  } catch (error) {
    failureResponse(res, error);
  }
});

module.exports = router;
