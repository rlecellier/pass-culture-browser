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
      jest.spyOn(Date, 'now').mockImplementation(() => '2020-01-01T20:00:00Z')

      state.data.users = [
        {
          id: 'FY',
        },
      ]
      const ownProps = {
        match: {
          params: {
            offerId: 'AE',
          },
        },
      }

      // when
      const result = mapStateToProps(state, ownProps)

      // then
      expect(result).toStrictEqual({
        recommendation: undefined,
        seenOffer: {
          dateSeen: '2020-01-01T20:00:00.000Z',
          offerId: 'AE',
          userId: 'FY',
        },
      })
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
  })
})
