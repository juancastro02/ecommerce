const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('ordenfinal', {
        contador: {
          type: DataTypes.INTEGER,
        }
    });
  };