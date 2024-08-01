"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Course, {
        as: "course",
      });
    }
  }
  Chapter.init(
    {
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "课程ID必须填写。",
          },
          notEmpty: {
            msg: "课程ID不能为空。",
          },
          async isPresent(value) {
            const category = await sequelize.models.Category.findByPk(value);
            if (!category) {
              throw new Error(`ID为:${value}的课程不存在。`);
            }
          },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "标题必须填写。",
          },
          notEmpty: {
            msg: "标题不能为空。",
          },
          len: {
            args: [2, 45],
            msg: "标题长度需要在2到45个字符之间。",
          },
        },
      },
      content: DataTypes.TEXT,
      video: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "视频链接必须是一个有效的URL。" },
        },
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "排序必须填写。" },
          notEmpty: { msg: "排序不能为空。" },
          isInt: { msg: "排序必须是整数。" },
          isPositive(value) {
            if (value <= 0) {
              throw new Error("排序必须是一个正整数。");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Chapter",
    }
  );
  return Chapter;
};
