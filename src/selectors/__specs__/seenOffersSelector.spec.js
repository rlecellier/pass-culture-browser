import { seenOffersSelector } from '../seenOffers/seenOffersSelector'

describe('seenOffersSelector', () => {
  it('should return seenOffers from state', () => {
    // given
    const state = {
      seenOffers: [
        {
          offerId: 'AE',
          userId: 'FY',
          dateSeen: '2020-04-16T14:19:51.913Z',
        },
      ],
    }

    // when
    const result = seenOffersSelector(state)

    // then
    expect(result).toStrictEqual([
      {
        offerId: 'AE',
        userId: 'FY',
        dateSeen: '2020-04-16T14:19:51.913Z',
      },
    ])
  })
})
