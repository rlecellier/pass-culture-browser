import moment from 'moment'

import { mapDispatchToProps, mapStateToProps } from '../CardContainer'
import { configureStore } from '../../../../../../utils/store'

navigator.geolocation = {}

describe('src | components | pages | discovery | Deck | Card | CardContainer', () => {
  describe('mapStateToProps', () => {
    it('default return', () => {
      // given
      const { store } = configureStore()
      const state = store.getState()
      state.data.users = [
        {
          id: 'FY',
        },
      ]

      const ownProps = {
        match: { params: {} },
      }

      // when
      const result = mapStateToProps(state, ownProps)

      // then
      const expected = {
        recommendation: undefined,
        seenOffer: {
          offerId: undefined,
          userId: 'FY',
        },
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('mapDispatchToProps', () => {
    it('handleReadRecommendation', () => {
      // given
      const { store } = configureStore()
      const recommendation = { id: 'AE' }

      // when
      mapDispatchToProps(store.dispatch).handleReadRecommendation(recommendation)

      // then
      const {
        data: { readRecommendations },
      } = store.getState()
      expect(readRecommendations).toHaveLength(1)
      expect(readRecommendations[0].id).toStrictEqual('AE')
      expect(moment(readRecommendations[0].dateRead).isSame(moment.utc(), 'minutes')).toStrictEqual(
        true
      )
    })
    it('handleSeenOffer', () => {
      // given
      const { store } = configureStore()
      const seenOffer = { offerId: 'AE', userId: 'FY' }

      // when
      mapDispatchToProps(store.dispatch).handleSeenOffer(seenOffer)

      // then
      const { seenOffers } = store.getState()
      expect(seenOffers).toHaveLength(1)
      expect(seenOffers[0].offerId).toStrictEqual('AE')
      expect(seenOffers[0].userId).toStrictEqual('FY')
      expect(moment(seenOffers[0].dateRead).isSame(moment.utc(), 'minutes')).toStrictEqual(true)
    })
  })
})
