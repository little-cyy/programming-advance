"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Course.belongsTo(models.Category, {
        as: "category",
      });
      models.Course.belongsTo(models.User, {
        as: "user",
      });
      models.Course.hasMany(models.Chapter, {
        as: "chapters",
      });
    }
  }
  Course.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "分类ID必须填写。",
          },
          notEmpty: {
            msg: "分类ID不能为空。",
          },
          async isPresent(value) {
            const category = await sequelize.models.Category.findByPk(value);
            if (!category) {
              throw new Error(`ID为:${value}的分类不存在。`);
            }
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "用户ID必须填写。",
          },
          notEmpty: {
            msg: "用户ID不能为空。",
          },
          async isPresent(value) {
            const user = await sequelize.models.User.findByPk(value);
            if (!user) {
              throw new Error(`ID为:${value}的用户不存在。`);
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "课程名称必须填写。",
          },
          notEmpty: {
            msg: "课程名称不能为空。",
          },
          len: {
            args: [2, 50],
            msg: "课程名称长度必须在2到50个字符之间。",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            msg: "课程图片必须是一个有效的URL。",
          },
        },
      },
      recommended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      introductory: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      content: DataTypes.TEXT,
      likesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "点赞数必须是一个整数。",
          },
          notNull: {
            msg: "点赞数必须填写。",
          },
          notEmpty: {
            msg: "点赞数不能为空。",
          },
        },
      },
      chaptersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "章节数量必须是一个整数。",
          },
          notNull: {
            msg: "章节数量必须填写。",
          },
          notEmpty: {
            msg: "章节数量不能为空。",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
