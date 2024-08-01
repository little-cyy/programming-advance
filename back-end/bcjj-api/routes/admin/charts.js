const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../../models");
const { successResponse, failureResponse } = require("../../utils/responses");

router.get("/sex", async (req, res, next) => {
  try {
    const male = await User.count({ where: { sex: 0 } });
    const female = await User.count({ where: { sex: 1 } });
    const unknown = await User.count({ where: { sex: 2 } });
    successResponse(res, "查询用户性别。", {
      data: [
        { value: male, name: "男性" },
        { value: female, name: "女性" },
        { value: unknown, name: "未选择" },
      ],
    });
  } catch (error) {
    failureResponse(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const [result] = await sequelize.query(
      "SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count FROM Users GROUP BY month ORDER BY month ASC"
    );
    const data = {
      months: [],
      counts: [],
    };
    result.forEach((item) => {
      data.months.push(item.month);
      data.counts.push(item.count);
    });
    successResponse(res, "查询每月用户数量成功。", { data });
  } catch (error) {
    failureResponse(error);
  }
});

module.exports = router;
