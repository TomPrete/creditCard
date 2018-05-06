import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store, {addNewTransaction, getAllUserTransactions} from '../store'

/**
 * COMPONENT
 */

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchase: 0,
      payment: 0,
    }
    this.inputPurchase = this.inputPurchase.bind(this)
    this.inputPayment = this.inputPayment.bind(this)
    this.handleSubmitDebitTransaction = this.handleSubmitDebitTransaction.bind(this)
    this.handleSubmitPaymentTransaction = this.handleSubmitPaymentTransaction.bind(this)
    this.generateInterestOwed = this.generateInterestOwed.bind(this)
  }

  async componentDidMount() {

    let userId = Number(this.props.match.params.id)
    const getUserTransactions = await getAllUserTransactions(userId)
    await store.dispatch(getUserTransactions)
  }
  inputPurchase(e) {
    this.setState({
      purchase: e.target.value,
    })
  }

  inputPayment(e) {
    this.setState({
      payment: e.target.value,
    })
  }


  handleSubmitDebitTransaction(e) {
    e.preventDefault()
    this.props.addNewTransaction(this.state.purchase, this.state.payment, this.props.user.id)
  }

  handleSubmitPaymentTransaction(e) {
    e.preventDefault()
    this.props.addNewTransaction(this.state.purchase, this.state.payment, this.props.user.id)
  }

  generateInterestOwed(transaction) {
    let apr = Number(this.props.user.apr)
    let openDate = this.props.user.createdAt
    let sum = 0;
    for(let key in transaction) {
      let obj = transaction[key]
      console.log(obj)
      for(let prop in obj) {
        if(prop === 'purchase') {
          let value = Number(obj[prop]) * -1;
          sum += value
        }
      }
    }
    let totalInt = (sum * (.35/365) * 30).toFixed(2)
    alert("Total Interest: $" + totalInt)

  }

//   for (var key in validation_messages) {
//     // skip loop if the property is from prototype
//     if (!validation_messages.hasOwnProperty(key)) continue;

//     var obj = validation_messages[key];
//     for (var prop in obj) {
//         // skip loop if the property is from prototype
//         if(!obj.hasOwnProperty(prop)) continue;

//         // your code
//         alert(prop + " = " + obj[prop]);
//     }
// }

  render() {
    let user = this.props.user
    let transaction = this.props.transaction
    return (
      <div>
        <h3>Welcome, {user.name}</h3>
        <p>Card Number: {user.cardNumber}</p>
        <p>Credit Limit: {user.limit}</p>
        <p>APR: {user.apr}</p>
        <form onSubmit={this.handleSubmitDebitTransaction} name='transaction' >
        <p>$</p><input type='text' placeholder='Enter Amount (ex: $3.17)' onChange={this.inputPurchase}/>
        <div className='submit-transaction'>
            <button className="transaction-button" type='submit'>Submit Purchase</button>
          </div>
        </form>
        <form onSubmit={this.handleSubmitPaymentTransaction} name='transaction' >
        <p>$</p><input type='text' placeholder='Enter Amount (ex: $45.17)' onChange={this.inputPayment}/>
        <div className='submit-transaction'>
            <button className="transaction-button" type='submit'>Submit Payment</button>
          </div>
        </form>
        <div id="projects-container">
        {/*<label>THESE ARE THE USER TRANSACTIONS</label>*/}

      </div>
      <div>
      </div>
          <button className="transaction-button" onClick={() => this.generateInterestOwed(this.props.transaction)}>See Total Interest Owed To Date</button>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
    transaction: state.transaction
  }
}

const mapDispatch = {addNewTransaction, getAllUserTransactions}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
