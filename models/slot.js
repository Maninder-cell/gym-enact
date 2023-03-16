'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Slot.belongsTo(models.Availability,{
        foreignKey: 'availability_id'
      })
    }
  }
  Slot.init({
    user_id: DataTypes.INTEGER,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    availability_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Slot',
  });
  return Slot;
};