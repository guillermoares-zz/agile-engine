import React from 'react';
import {act} from 'react-dom/test-utils'
import App, {
  APP_ACTION,
  APP_STATUS,
  AppReducer,
  errorMessage,
  REFRESHING_STATE,
  SUCCESS_MESSAGE,
  unknownActionMessage,
  client, REFRESHING_MESSAGE
} from './App';
import TransactionsView from './transactions-view/transactions-view';
import {mount, shallow} from 'enzyme';
import StatusInfo, {STATUS_INFO_KIND} from './status-info/status-info';
import RefreshButton from './refresh-button/refresh-button';

describe('App', () => {
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
    const wrapper = shallow(<App/>)

    expect(wrapper).toMatchSnapshot()
  })

  describe('Reducer', () => {

    it('should show that the transactions list is refreshing', () => {
      const newState = AppReducer(null, {
        type: APP_ACTION.REFRESH
      })

      expect(newState).toEqual(REFRESHING_STATE)
    })

    it('should show the transactions', () => {
      const newState = AppReducer(null, {
        type: APP_ACTION.SHOW_TRANSACTIONS,
        transactions: SAMPLE_TRANSACTIONS
      })

      expect(newState).toEqual({
        status: APP_STATUS.SUCCESS,
        message: SUCCESS_MESSAGE,
        transactions: SAMPLE_TRANSACTIONS
      })
    })

    it('should show refresh errors', () => {
      const error = new Error('some error message')
      const newState = AppReducer(null, {
        type: APP_ACTION.SHOW_ERROR,
        error
      })

      expect(newState).toEqual({
        status: APP_STATUS.ERROR,
        message: errorMessage(error),
        transactions: []
      })
    })

    it('should detect unknown actions', () => {
      const unknownAction = {type: 'UNKNOWN'}

      expect(() => AppReducer(null, unknownAction))
        .toThrowError(new Error(unknownActionMessage(unknownAction)))
    })
  })

  describe('Rendering', () => {
    beforeEach(() => {
      jest.spyOn(client, 'get')
        .mockImplementation()
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('renders the TransactionsView', () => {
      let wrapper = shallow(<App/>);
      expect(wrapper.find(TransactionsView).length).toEqual(1);
    });

    it('renders the StatusInfo', () => {
      let wrapper = shallow(<App/>);
      expect(wrapper.find(StatusInfo).length).toEqual(1);
    });

    it('renders the RefreshButton', () => {
      let wrapper = shallow(<App/>);
      expect(wrapper.find(RefreshButton).length).toEqual(1);
    });

    it('retrieves transactions on init', async () => {
      await act(async () => {
        mount(<App/>);
      });
      expect(client.get).toBeCalledWith('/transactions?delay=2000')
    })

    it('shows as refreshing at initialization', async () => {
      let wrapper

      await act(async () => {
        wrapper = mount(<App/>);
      })

      expect(wrapper.find(StatusInfo).props()).toEqual({
        message: REFRESHING_MESSAGE,
        kind: STATUS_INFO_KIND.INFO
      })

      expect(wrapper.find(TransactionsView).props()).toEqual({
        isRefreshing: true,
        transactions: []
      })

      expect(wrapper.find(RefreshButton).props().isRefreshing).toBe(true)
      expect(wrapper.find(RefreshButton).props().refreshAction).toBeDefined()
    })

    it('shows as refreshing while transactions are being retrieved', async () => {
      client.get = () => new Promise(res => setInterval(res, 2000))

      let wrapper

      await act(async () => {
        wrapper = mount(<App/>);
      })

      wrapper.update()

      expect(wrapper.find(StatusInfo).props()).toEqual({
        message: REFRESHING_MESSAGE,
        kind: STATUS_INFO_KIND.INFO
      })

      expect(wrapper.find(TransactionsView).props()).toEqual({
        isRefreshing: true,
        transactions: []
      })

      expect(wrapper.find(RefreshButton).props().isRefreshing).toBe(true)
      expect(wrapper.find(RefreshButton).props().refreshAction).toBeDefined()
    })

    it('shows retrieved transactions', async () => {
      client.get = () => ({data: SAMPLE_TRANSACTIONS})

      let wrapper

      await act(async () => {
        wrapper = mount(<App/>);
      })

      wrapper.update()

      expect(wrapper.find(StatusInfo).props()).toEqual({
        message: SUCCESS_MESSAGE,
        kind: STATUS_INFO_KIND.SUCCESS
      })

      expect(wrapper.find(TransactionsView).props()).toEqual({
        isRefreshing: false,
        transactions: SAMPLE_TRANSACTIONS
      })

      expect(wrapper.find(RefreshButton).props().isRefreshing).toBe(false)
      expect(wrapper.find(RefreshButton).props().refreshAction).toBeDefined()
    })

    it('shows errors while retrieving transactions', async () => {
      const error = new Error('Some error occurred')
      client.get = () => {
        throw error
      }

      let wrapper

      await act(async () => {
        wrapper = mount(<App/>);
      })

      wrapper.update()

      expect(wrapper.find(StatusInfo).props()).toEqual({
        message: errorMessage(error),
        kind: STATUS_INFO_KIND.ERROR
      })

      expect(wrapper.find(TransactionsView).props()).toEqual({
        isRefreshing: false,
        transactions: []
      })

      expect(wrapper.find(RefreshButton).props().isRefreshing).toBe(false)
      expect(wrapper.find(RefreshButton).props().refreshAction).toBeDefined()
    })
  })
})
