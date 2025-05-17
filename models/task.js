'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      models.Task.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      dueDate: DataTypes.DATE,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Task'
    }
  );

  return Task;
};
