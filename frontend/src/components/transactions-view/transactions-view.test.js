import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer'
import TransactionsView, {
  REFRESHING_MESSAGE,
  NO_TRANSACTIONS_MESSAGE,
  TransactionsViewItem,
  TransactionsViewItemHeader, TransactionsViewItemBody
} from './transactions-view';
import {Accordion} from 'react-bootstrap';


describe('StatusInfo', () => {
  const SAMPLE_TRANSACTIONS = [
    {
      'id': 'e6bea53e-f768-4648-92ec-bdb3ebbdbde1',
      'type': 'credit',
      'amount': 30,
      'effectiveDate': '2020-05-17T15:47:50.643Z'
    },
    {
      'id': '7c75109c-b547-4d1a-b873-e9d7a64c2248',
      'type': 'debit',
      'amount': 23,
      'effectiveDate': '2020-05-17T15:43:23.224Z'
    }
  ]

  test('snapshot renders', () => {
    const component = renderer.create(<TransactionsView transactions={[]}/>)

    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('should show no accordion and a message while refreshing', () => {
      let wrapper = shallow(<TransactionsView transactions={[]} isRefreshing={true}/>);

      expect(wrapper.find('h3').length).toBe(1)
      expect(wrapper.find('h3').props().children).toEqual(REFRESHING_MESSAGE)
      expect(wrapper.find(Accordion).exists()).toBe(false)
    });

    it('should show no accordion and a message when there are no transactions to show', () => {
      let wrapper = shallow(<TransactionsView transactions={[]} isRefreshing={false}/>);

      expect(wrapper.find('h3').length).toBe(1)
      expect(wrapper.find('h3').props().children).toEqual(NO_TRANSACTIONS_MESSAGE)
      expect(wrapper.find(Accordion).exists()).toBe(false)
    })

    it('should show transactions in accordion', () => {
      let wrapper = shallow(<TransactionsView transactions={SAMPLE_TRANSACTIONS} isRefreshing={false}/>);

      expect(wrapper.find(TransactionsViewItem).length).toBe(SAMPLE_TRANSACTIONS.length)
      expect(wrapper.find(TransactionsViewItem).map(w => w.props()))
        .toEqual(SAMPLE_TRANSACTIONS.map((transaction, index) => ({transaction, index})))
    })

    it('should show transaction headers', () => {
      const transactions = SAMPLE_TRANSACTIONS.slice(-1)

      let wrapper = mount(<TransactionsView transactions={transactions} isRefreshing={false}/>);

      expect(wrapper.find(TransactionsViewItemHeader).length).toBe(1)
      expect(wrapper.find(TransactionsViewItemHeader).props()).toEqual({transaction: transactions[0]})
    })

    it('should show transaction bodies', () => {
      const transactions = SAMPLE_TRANSACTIONS.slice(-1)

      let wrapper = mount(<TransactionsView transactions={transactions} isRefreshing={false}/>);

      expect(wrapper.find(TransactionsViewItemBody).length).toBe(1)
      expect(wrapper.find(TransactionsViewItemBody).props()).toEqual({transaction: transactions[0]})
    })
  })
})