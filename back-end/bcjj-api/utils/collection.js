/**
 * @param {Array} collection
 * @returns {any}
 * @description 随机返回集合中的元素
 */
function sample(collection) {
  return collection[Math.floor(Math.random() * collection.length)];
}
module.exports = { sample };
