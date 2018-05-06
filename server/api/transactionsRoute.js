const router = require('express').Router()
const {Transaction} = require('../db/models')
module.exports = router

router.post('/', (req, res, next) => {
  console.log('******BODY*********: ', req.body)
  return Transaction.create(req.body)
    .then(transaction => res.json(transaction))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = +req.params.id
  Transaction.findAll({
    where: {
      userId: id,
    }
  })
    .then(transactions => res.json(transactions))
    .catch(next);
})
