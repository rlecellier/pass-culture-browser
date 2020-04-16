import seenOffers, { EDIT_SEEN_OFFERS, editSeenOffers } from '../seenOffers'

describe('src | reducers | seenOffers', () => {
  it('should return the initial state by default', () => {
    // given
    const action = {}
    const state = [{ data: [] }]
    // when
    const updatedState = seenOffers(state, action)
    const expectedState = [{ data: [] }]

    // then
    expect(updatedState).toStrictEqual(expectedState)
  })

  it('should set state when action is EDIT_SEEN_OFFERS', () => {
    // given
    const state = [
      {
        dateSeen: '2020-04-16T14:19:41.913Z',
        offerId: 'AB',
        userId: 'FY',
      },
    ]
    const action = {
      offerId: 'CD',
      userId: 'FY',
      dateSeen: '2020-04-16T14:19:51.913Z',
      type: EDIT_SEEN_OFFERS,
    }

    // when
    const updatedState = seenOffers(state, action)
    const expectedState = [
      {
        dateSeen: '2020-04-16T14:19:41.913Z',
        offerId: 'AB',
        userId: 'FY',
      },
      {
        dateSeen: '2020-04-16T14:19:51.913Z',
        offerId: 'CD',
        userId: 'FY',
      },
    ]

    // then
    expect(updatedState).toStrictEqual(expectedState)
  })
})

describe('src | reducers | editSeenOffers', () => {
  it('should return correct action type', () => {
    // given
    const data = {
      offerId: 'CD',
      userId: 'FY',
      dateSeen: '2020-04-16T14:19:51.913Z',
    }

    // when
    const action = editSeenOffers(data)
    const expected = {
      offerId: 'CD',
      userId: 'FY',
      dateSeen: '2020-04-16T14:19:51.913Z',
      type: 'EDIT_SEEN_OFFERS',
    }

    // then
    expect(action).toMatchObject(expected)
  })
})
