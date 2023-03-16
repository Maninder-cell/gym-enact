'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Availability.belongsTo(models.User,{
        foreignKey: 'user_id'
      })

      Availability.hasMany(models.Slot,{
        foreignKey: 'availability_id'
      })
    }
  }
  Availability.init({
    date: DataTypes.DATE,
    slots_time_from: DataTypes.TIME,
    slots_time_to: DataTypes.TIME,
    session_length: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    break: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Availability',
  });
  return Availability;
};