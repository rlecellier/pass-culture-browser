import { mapStateToProps, mergeProps } from '../NavigationContainer'

describe('src | components | pages | discovery | Deck | Navigation | NavigationContainer', () => {
  describe('mapStateToProps', () => {
    describe('when mapping distanceClue', () => {
      describe('when venue is virtual', () => {
        it('should return "offre en ligne"', () => {
          // given
          const state = {
            data: {
              recommendations: [{ offerId: 'AE', mediationId: 'FG' }],
              offers: [
                {
                  id: 'AE',
                  venue: {
                    isVirtual: true,
                  },
                },
              ],
              stocks: [{ offerId: 'AE' }],
            },
            geolocation: {
              latitude: '',
              longitude: '',
            },
          }
          const ownProps = {
            match: {
              params: {
                mediationId: 'FG',
                offerId: 'AE',
              },
            },
          }

          // when
          const result = mapStateToProps(state, ownProps)

          // then
          expect(result.distanceClue).toBe('offre numérique')
        })
      })

      describe('when venue is not virtual', () => {
        it('should return the humanized relative distance', () => {
          // given
          const state = {
            data: {
              recommendations: [{ offerId: 'AE', mediationId: 'FG' }],
              offers: [
                {
                  id: 'AE',
                  venue: {
                    isVirtual: false,
                    latitude: 1,
                    longitude: 2,
                  },
                },
              ],
              stocks: [{ offerId: 'AE' }],
            },
            geolocation: {
              latitude: 1,
              longitude: 2,
            },
          }
          const ownProps = {
            match: {
              params: {
                mediationId: 'FG',
                offerId: 'AE',
              },
            },
          }

          // when
          const result = mapStateToProps(state, ownProps)

          // then
          expect(result.distanceClue).toBe('0 m')
        })
      })
    })

    it('should map priceRange', () => {
      // given
      const state = {
        data: {
          recommendations: [{ offerId: 'AE', mediationId: 'FG' }],
          offers: [{ id: 'AE' }],
          stocks: [
            { offerId: 'AE', price: 1, isBookable: true, quantity: 1 },
            { offerId: 'AE', price: 4, isBookable: true, quantity: 1 },
          ],
        },
        geolocation: {
          latitude: '',
          longitude: '',
        },
      }
      const ownProps = {
        match: {
          params: {
            mediationId: 'FG',
            offerId: 'AE',
          },
        },
      }

      // when
      const result = mapStateToProps(state, ownProps)

      // then
      expect(result.priceRange).toStrictEqual([1, 4])
    })

    describe('when mapping separatior', () => {
      describe('when offer exists', () => {
        it('should return "\u00B7"', () => {
          // given
          const state = {
            data: {
              recommendations: [{ offerId: 'AE', mediationId: 'FG' }],
              offers: [{ id: 'AE' }],
              stocks: [
                { offerId: 'AE', price: 1, isBookable: true, quantity: 1 },
                { offerId: 'AE', price: 4, isBookable: true, quantity: 1 },
              ],
            },
            geolocation: {
              latitude: '',
              longitude: '',
            },
          }
          const ownProps = {
            match: {
              params: {
                mediationId: 'FG',
                offerId: 'AE',
              },
            },
          }

          // when
          const result = mapStateToProps(state, ownProps)

          // then
          expect(result.separator).toBe('\u00B7')
        })
      })

      describe('when offer does not exists', () => {
        it('should an empty string with a space', () => {
          // given
          const state = {
            data: {
              recommendations: [{ offerId: 'AE', mediationId: 'FG' }],
              offers: [],
              stocks: [
                { offerId: 'AE', price: 1, isBookable: true, quantity: 1 },
                { offerId: 'AE', price: 4, isBookable: true, quantity: 1 },
              ],
            },
            geolocation: {
              latitude: '',
              longitude: '',
            },
          }
          const ownProps = {
            match: {
              params: {
                mediationId: 'FG',
                offerId: 'AE',
              },
            },
          }

          // when
          const result = mapStateToProps(state, ownProps)

          // then
          expect(result.separator).toBe(' ')
        })
      })
    })
  })

  describe('mergeProps', () => {
    it('should spread all stateProps, dispatchProps and ownProps into mergedProps', () => {
      // given
      const stateProps = {
        favorite: { offerId: 'B4' },
      }
      const dispatchProps = {
        anyDispatchFunction: () => {},
      }
      const ownProps = {
        match: {
          params: {
            offerId: 'B4',
          },
        },
      }

      // when
      const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)

      // then
      expect(mergedProps).toStrictEqual({
        favorite: { offerId: 'B4' },
        anyDispatchFunction: expect.any(Function),
        trackConsultOffer: expect.any(Function),
        match: {
          params: {
            offerId: 'B4',
          },
        },
      })
    })

    it('should map a tracking event for consulting an offer', () => {
      // given
      const stateProps = {
        favorite: { offerId: 'B4' },
      }
      const ownProps = {
        match: {
          params: {
            offerId: 'B4',
          },
        },
        tracking: {
          trackEvent: jest.fn(),
        },
      }

      // when
      mergeProps(stateProps, {}, ownProps).trackConsultOffer()

      // then
      expect(ownProps.tracking.trackEvent).toHaveBeenCalledWith({
        action: 'consultOffer',
        name: 'B4',
      })
    })
  })
})
