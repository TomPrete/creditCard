import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const INPUT_TRANSACTION = 'INPUT_TRANSACTION'
const GET_USER_TRANSACTIONS = 'GET_USER_TRANSACTIONS'
const ADD_USER = 'ADD_USER'

/**
 * INITIAL STATE
 */
const defaultTrans = {}

/**
 * ACTION CREATORS
 */
const addTransaction = transaction => ({ type: INPUT_TRANSACTION, transaction })
const getUserTransactions = transactions => ({ type: GET_USER_TRANSACTIONS, transactions })
// const addUser = user => ({ type: ADD_USER, user })

/**
 * THUNK CREATORS
 */


export const addNewTransaction = (purchase, payment, userId) =>
  dispatch =>
    axios.post('/api/transactions', { purchase, payment, userId})
      .then(trans => {
        window.location.reload()
        return trans.data
      })
      .then(trans => {
        const action = getUserTransactions(trans)
        dispatch(getUserTransactions(action))
      }, authError => { // rare example: a good use case for parallel (non-catch) error handler
        dispatch(getUserTransactions({ error: authError }))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))


export const getAllUserTransactions = (userId) =>
  dispatch => {
    axios.get(`/api/transactions/${userId}`)
    .then(res => res.data)
    .then(transactions =>
      dispatch(getUserTransactions(transactions)))
    .catch(err => console.error(err))
}
/**
 * REDUCER
 */
export default function (state = defaultTrans, action) {
  switch (action.type) {
    case INPUT_TRANSACTION:
      return action.transaction
    case GET_USER_TRANSACTIONS:
      return action.transactions
    default:
      return state
  }
}
