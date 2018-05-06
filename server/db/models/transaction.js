const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  purchase: {
    type: Sequelize.DECIMAL,
  },

  payment: {
    type: Sequelize.DECIMAL,

  },
}
)

module.exports = Transaction

/**
 * instanceMethods
 */


/**
 * hooks
 */

Transaction.hook('beforeValidate',(transaction) => {
  transaction.purchase = Number(transaction.purchase) * -1;
  transaction.payment = Number(transaction.payment)
})
