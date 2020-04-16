import { mapDispatchToProps, mapStateToProps } from '../DiscoveryContainer'
import { recommendationNormalizer } from '../../../../utils/normalizers'

jest.mock('redux-thunk-data', () => {
  const { assignData, createDataReducer, deleteData, requestData } = jest.requireActual(
    'fetch-normalize-data'
  )
  return {
    assignData,
    createDataReducer,
    deleteData,
    requestData,
  }
})
jest.useFakeTimers()

describe('src | components | pages | discovery | DiscoveryContainer', () => {
  let dispatch
  let replace
  let props

  beforeEach(() => {
    dispatch = jest.fn()
    replace = jest.fn()
    props = {
      history: {
        replace,
      },
      location: {
        search: '',
      },
      match: {
        params: {},
      },
      query: {
        parse: () => ({}),
      },
    }
  })

  describe('mapStateToProps()', () => {
    it('should return an object of props', () => {
      // given
      const state = {
        data: {
          recommendations: [],
        },
        pagination: {
          seedLastRequestTimestamp: 11111111112,
        },
        seenOffers : [],
      }

      const ownProps = {
        match: {
          params: {},
        },
      }

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        currentRecommendation: {
          index: 0,
          mediation: {
            frontText:
              'Vous avez parcouru toutes les offres. Revenez bientôt pour découvrir les nouveautés.',
            id: 'fin',
            thumbCount: 1,
            tutoIndex: -1,
          },
          mediationId: 'fin',
          productOrTutoIdentifier: 'tuto_-1',
          thumbUrl: 'http://localhost/splash-finReco@2x.png',
        },
        readRecommendations: undefined,
        recommendations: [],
        seedLastRequestTimestamp: 11111111112,
        seenOffers: [],
        shouldReloadRecommendations: true,
        tutorials: [],
      })
    })
  })

  describe('mapDispatchToProps()', () => {
    describe('when mapping loadRecommendations', () => {
      it('should load the recommendations with page equals 1 when no current recommendation', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {}
        const recommendations = []
        const readRecommendations = null
        const seenOffers = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: [],
              seenOffers: null
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load the recommendations with page equals 1 when current recommendation is a tuto', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = { mediationId: 'tuto' }
        const recommendations = []
        const readRecommendations = null
        const seenOffers = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: [],
              seenOffers: null
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load the recommendations with page equals 1 when current recommendation is the final card', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = { mediationId: 'fin' }
        const recommendations = []
        const readRecommendations = null
        const seenOffers = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: [],
              seenOffers: null
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load the recommendations with page equals 1 when current recommendation has an empty mediation', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = { mediationId: 'vide' }
        const recommendations = []
        const readRecommendations = null
        const seenOffers = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: [],
              seenOffers: null
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load the recommendations with page equals 2 when current recommendation is a valid one attached to an offer', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {
          id: 'ABC3',
          index: 1,
          offerId: 'ABC2',
        }
        const recommendations = [{ id: 'AE3', index: 3, offerId: 'AE4' }]
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const seenOffers = null
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: ['AE4'],
              seenOffers: null
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load offers seen by beneficiary  ', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {}
        const recommendations = [{ id: 'AE3', index: 3, offerId: 'AE4' }]
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const seenOffers = [
          {
          userId: 'FY',
          offerId: 'AE4',
          dateSeen:"2020-04-16T15:57:27.063Z"
        }
        ]
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          seenOffers,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: ['AE4'],
              seenOffers: [
                {
                  userId: 'FY',
                  offerId: 'AE4',
                  dateSeen:"2020-04-16T15:57:27.063Z"
                }
              ]
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

    })

    describe('when mapping redirectToFirstRecommendationIfNeeded', () => {
      describe('when there are no recommendations', () => {
        it('should return undefined', () => {
          // given
          const loadedRecommendations = []

          // when
          const redirect = mapDispatchToProps(
            dispatch,
            props
          ).redirectToFirstRecommendationIfNeeded(loadedRecommendations)

          // then
          expect(redirect).toBeUndefined()
        })
      })

      describe('when not on discovery pathname', () => {
        it('should return undefined', () => {
          // given
          const loadedRecommendations = [{ id: 'firstRecommendation' }]
          props.location.pathname = ''

          // when
          const redirect = mapDispatchToProps(
            dispatch,
            props
          ).redirectToFirstRecommendationIfNeeded(loadedRecommendations)

          // then
          expect(redirect).toBeUndefined()
        })
      })

      describe('when visiting for the first time', () => {
        it('should redirect to tuto recommendation with a specified mediation', () => {
          // given
          const dispatch = jest.fn()
          const loadedRecommendations = [{ id: 'QA3D', offerId: null, mediationId: 'A9' }]
          const ownProps = {
            history: {
              replace: jest.fn(),
            },
            match: {
              url: '/decouverte',
              params: {},
            },
          }

          // when
          mapDispatchToProps(dispatch, ownProps).redirectToFirstRecommendationIfNeeded(
            loadedRecommendations
          )

          // then
          expect(ownProps.history.replace).toHaveBeenCalledWith('/decouverte/tuto/A9')
        })

        it('should redirect to tuto recommendation without mediation', () => {
          // given
          const dispatch = jest.fn()
          const loadedRecommendations = [{ id: 'QA3D', offerId: null, mediationId: null }]
          const ownProps = {
            history: {
              replace: jest.fn(),
            },
            match: {
              url: '/decouverte',
              params: {},
            },
          }

          // when
          mapDispatchToProps(dispatch, ownProps).redirectToFirstRecommendationIfNeeded(
            loadedRecommendations
          )

          // then
          expect(ownProps.history.replace).toHaveBeenCalledWith('/decouverte/tuto/vide')
        })

        it('should delete tutos from store when leaving discovery', () => {
          // given
          const tutos = {
            id: 'ABCD',
          }

          // when
          mapDispatchToProps(dispatch, null).deleteTutorials(tutos)

          // then
          expect(dispatch).toHaveBeenCalledWith({
            config: {},
            patch: {
              recommendations: {
                id: 'ABCD',
              },
            },
            type: 'DELETE_DATA',
          })
        })
      })
    })

    describe('when mapping resetReadRecommendations', () => {
      it('should reset recommendations with the right configuration', () => {
        // when
        mapDispatchToProps(dispatch, props).resetReadRecommendations()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          patch: { readRecommendations: [] },
          type: 'ASSIGN_DATA',
        })
      })
    })

    describe('when mapping saveLastRecommendationsRequestTimestamp', () => {
      it('should save recommendations loaded timestamp with the right configuration', () => {
        // when
        mapDispatchToProps(dispatch, props).saveLastRecommendationsRequestTimestamp()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SAVE_RECOMMENDATIONS_REQUEST_TIMESTAMP',
        })
      })
    })

    describe('when mapping updateLastRequestTimestamp', () => {
      it('should save update last seed request timestamp', () => {
        // when
        mapDispatchToProps(dispatch, props).updateLastRequestTimestamp()

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          seedLastRequestTimestamp: expect.any(Number),
          type: 'UPDATE_SEED_LAST_REQUEST_TIMESTAMP',
        })
      })
    })

    describe('when mapping resetRecommendations', () => {
      it('should delete all recommandetions in the store', () => {
        // when
        mapDispatchToProps(dispatch, props).resetRecommendations()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          patch: { recommendations: [] },
          type: 'ASSIGN_DATA',
        })
      })
    })

    describe('when mapping resetSeenOffers', () => {
      it('should delete all recommandations in the store', () => {
        // when
        mapDispatchToProps(dispatch, props).resetSeenOffers()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          patch: { seenOffers: [] },
          type: 'ASSIGN_DATA',
        })
      })
    })
  })
})
