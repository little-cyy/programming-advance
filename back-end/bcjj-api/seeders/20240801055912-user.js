"use strict";

/** @type {import('sequelize-cli').Migration} */
const { sample } = require("../utils/collection");
const bcrypt = require("bcryptjs");
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
    let users = [
      {
        username: "admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("123123", 10),
        nickName: "超级管理员",
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const counts = 10;

    for (let i = 1; i <= counts; i++) {
      const user = {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: bcrypt.hashSync("123123", 10),
        nickName: `普通用户${i}`,
        sex: sample([0, 1, 2]),
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
    }

    await queryInterface.bulkInsert("Users", users, {});
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
