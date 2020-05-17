import './transactions-view.scss'
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import capitalize from 'capitalize'
import {Jumbotron} from 'react-bootstrap';

export const REFRESHING_MESSAGE = 'Refreshing...'
export const NO_TRANSACTIONS_MESSAGE = 'No transactions to show'

const TransactionsView = ({transactions, isRefreshing}) => {
  if (isRefreshing)
    return (<Jumbotron>
      <h3>{REFRESHING_MESSAGE}</h3>
    </Jumbotron>)

  if (!transactions.length)
    return (<Jumbotron>
      <h3>{NO_TRANSACTIONS_MESSAGE}</h3>
    </Jumbotron>)

  return (
    <Accordion>
      {transactions
        .map((t, i) => <TransactionsViewItem key={i} index={i} transaction={t}/>)}
    </Accordion>
  )
}

export const TransactionsViewItem = ({transaction, index}) => {
  return (<Card>
    <Card.Header as="h3">
      <Accordion.Toggle as={Card.Header} eventKey={index}>
        <TransactionsViewItemHeader transaction={transaction}/>
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={index}>
      <Card.Body>
        <TransactionsViewItemBody transaction={transaction}/>
      </Card.Body>
    </Accordion.Collapse>
  </Card>)
}

export const TransactionsViewItemHeader = ({transaction}) => {
  return (<div className={transaction.type + '-title'}>
    {capitalize(transaction.type)} of ${transaction.amount}
  </div>)
}

export const TransactionsViewItemBody = ({transaction}) => {
  return <pre className="text-left">
    {JSON.stringify(transaction, null, 2)}
  </pre>
}

export default TransactionsView