const { Sequelize, Model, DataTypes } = require("sequelize");
const { database, user, password, host, port } = require("../mysqlConfig");

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
  port: port,
});

class User2 extends Model {}
User2.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false, tableName: "users" }
);

module.exports.sequelize = sequelize;
module.exports.User2 = User2;
