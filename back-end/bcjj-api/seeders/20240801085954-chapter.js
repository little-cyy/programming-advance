"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Chapters",
      [
        {
          courseId: 1,
          title: "CSS 课程介绍",
          content:
            "CSS 是层叠样式表（Cascading Style Sheets）的缩写，是一种用于描述网页样式的语言。CSS 可以用来控制网页中的文本、图像、背景、布局等元素的外观和布局。",
          video: "",
          rank: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 2,
          title: "Node.js 课程介绍",
          content:
            "Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它允许开发者使用 JavaScript 编写服务器端应用程序。",
          video: "",
          rank: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 2,
          title: "安装 Node.js",
          content:
            "在开始使用 Node.js 之前，您需要先安装 Node.js。您可以从 Node.js 的官方网站（https://nodejs.org/）下载适合您操作系统的安装程序，并按照安装向导进行安装。",
          video: "",
          rank: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 2,
          title: "创建第一个 Node.js 应用程序",
          content:
            "在安装了 Node.js 之后，您可以使用它来创建第一个 Node.js 应用程序。以下是一个简单的示例：",
          video: "",
          rank: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 2,
          title: "使用 npm 管理项目依赖",
          content:
            "npm 是 Node.js 的包管理器，它可以帮助您管理项目的依赖关系。您可以使用 npm 安装、更新和卸载项目所需的包。",
          video: "",
          rank: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
