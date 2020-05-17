import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'
import React, {useEffect, useReducer} from 'react';
import TransactionsView from './transactions-view/transactions-view';
import axios from 'axios';
import {Container} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import RefreshButton from './refresh-button/refresh-button';
import StatusInfo, {STATUS_INFO_KIND} from './status-info/status-info';

export const client = axios.create({
  baseURL: `http://localhost:3000`,
  timeout: 5000,
})

export const APP_STATUS = {
  REFRESHING: 'refreshing',
  ERROR: 'error',
  SUCCESS: 'success'
}

export const STATUS_INFO_KIND_BY_APP_STATUS = {
  [APP_STATUS.REFRESHING]: STATUS_INFO_KIND.INFO,
  [APP_STATUS.ERROR]: STATUS_INFO_KIND.ERROR,
  [APP_STATUS.SUCCESS]: STATUS_INFO_KIND.SUCCESS
}

export const APP_ACTION = {
  REFRESH: 'refresh',
  SHOW_ERROR: 'show_error',
  SHOW_TRANSACTIONS: 'show_transactions'
}

export const SUCCESS_MESSAGE = 'Transactions retrieved successfully'
export const REFRESHING_MESSAGE = 'Retrieving transactions...'
export const errorMessage = err => `Error retrieving transactions: ${err.message}`

export const unknownActionMessage = action => `Unknown App action type: ${JSON.stringify(action)}`

export const REFRESHING_STATE = {
  status: APP_STATUS.REFRESHING,
  message: REFRESHING_MESSAGE,
  transactions: []
}

export const INIT_STATE = REFRESHING_STATE

export const isRefreshing = status => status === APP_STATUS.REFRESHING

export const AppReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTION.REFRESH:
      return REFRESHING_STATE
    case APP_ACTION.SHOW_ERROR:
      return {
        status: APP_STATUS.ERROR,
        message: errorMessage(action.error),
        transactions: []
      }
    case APP_ACTION.SHOW_TRANSACTIONS:
      return {
        status: APP_STATUS.SUCCESS,
        message: SUCCESS_MESSAGE,
        transactions: action.transactions
      }
    default:
      throw new Error(unknownActionMessage(action))
  }
}

function App() {
  const [{
    status,
    message,
    transactions
  }, dispatch] = useReducer(AppReducer, INIT_STATE)

  const refreshTransactions = async () => {
    dispatch({type: APP_ACTION.REFRESH})

    try {
      // The delay query parameter forces the backend to delay the response.
      // The idea is to get to see the "loading" state of the component.
      const {data: transactions} = await client.get('/transactions?delay=2000')
      dispatch({
        type: APP_ACTION.SHOW_TRANSACTIONS,
        transactions
      })
    } catch (error) {
      dispatch({
        type: APP_ACTION.SHOW_ERROR,
        error
      })
    }
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  return (
    <Container fluid="md" className="main-container">
      <Card className="text-center main-card">
        <Card.Header as={'h1'}>
          Transaction History
        </Card.Header>
        <Card.Body>
          <TransactionsView transactions={transactions} isRefreshing={isRefreshing(status)}/>
        </Card.Body>
        <Card.Footer>
          <RefreshButton refreshAction={refreshTransactions} isRefreshing={isRefreshing(status)}/>
          <br/><br/>
          <StatusInfo message={message} kind={STATUS_INFO_KIND_BY_APP_STATUS[status]}/>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default App;