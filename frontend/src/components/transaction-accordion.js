import './transaction-accordion.css'
import * as React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

export default class TransactionAccordion extends React.Component {
  _client

  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
    }
    
    this._client = axios.create({
      baseURL: `http://localhost:3000`,
      timeout: 1000,
    })
  }

  componentDidMount() {
    this._update()
  }

  _update() {
    this._client.get('/transactions')
      .then(res => this.setState(() => ({transactions: res.data})))
  }
  
  _renderItemHeader(transaction) {
    return (<div className={transaction.type + "-title"}>{transaction.type} of ${transaction.amount}</div>)
  }

  _renderItem(transaction, index) {
    return (<Card key={index.toString()}>
      <Card.Header>
        <Accordion.Toggle as={Card.Header} eventKey={index}>
          {this._renderItemHeader(transaction)}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <pre>{JSON.stringify(transaction, null, 2)}</pre>
        </Card.Body>
      </Accordion.Collapse>
    </Card>)
  }

  render() {
    return (
      <div>
        <Accordion>
          {this.state.transactions
            .map((t, i) => this._renderItem(t, i))}
        </Accordion>
        <Button onClick={() => this._update()}>Update</Button>
      </div>
    )
  }
}