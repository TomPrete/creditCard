const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  cardNumber:  {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      notEmpty: true
    }
  },

  limit: {
    type: Sequelize.INTEGER,
    defaultValue: 1000,
    allowNull: false
  },

  apr: {
    type: Sequelize.DECIMAL,
    defaultValue: .35,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING
  },

  salt: {
    type: Sequelize.STRING
  },
}, {
  getterMethods: {
    name() {
      return this.firstName + ' ' + this.lastName;
    }
  }

})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt) === this.password
}

/**
 * classMethods
 */
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password, user.salt)
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

//USER GETS ASSIGNED A RANDOM BRANDED CREDIT CARD
User.hook('beforeValidate',(user) => {
  let cardType = {
    'American Express': "3",
    'Visa': "4",
    'MasterCard': "5",
    'Discover Card': "6",
  }
  let random = Math.floor(3 + Math.random() * 4);
  let card =  random.toString() + Math.floor(100000000000000 + Math.random() * 900000000000000);
  user.cardNumber = card;
})


//USER'S APR DEPENDS ON THE LENGTH OF THEIR LAST NAME
User.hook('afterValidate', user => {
  let nameLength = user.lastName.length;
  if(nameLength < 5) {
    user.apr = .30;
  } else if (nameLength >= 5 && nameLength < 8) {
    user.apr = .35;
  } else {
    user.apr = .40
  }
})
