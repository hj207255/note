var Sequelize = require('sequelize')
var path = require('path')

var sequelize = new Sequelize(undefined, undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',

  // SQLite only
  storage: path.join(__dirname, '../database/database.sqlite')
});

var Note = sequelize.define('note', {
  text: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  }
});

Note.sync()

module.exports = Note