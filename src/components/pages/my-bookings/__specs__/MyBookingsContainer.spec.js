import { mapDispatchToProps, mapStateToProps } from '../MyBookingsContainer'
import { myBookingsNormalizer } from '../../../../utils/normalizers'

jest.mock('redux-thunk-data', () => {
  const { requestData } = jest.requireActual('fetch-normalize-data')

  return {
    requestData,
  }
})

describe('src | components | pages | my-bookings | MyBookingsContainer', () => {
  describe('mapStateToProps()', () => {
    it('should return my bookings', () => {
      // given
      const state = {
        data: {
          bookings: [],
          features: [],
        },
      }

      // when
      const props = mapStateToProps(state)

      // then
      expect(props).toStrictEqual({
        bookings: expect.any(Object),
        isQrCodeFeatureDisabled: true,
      })
    })
  })

  describe('requestGetBookings()', () => {
    it('should dispatch my bookings', () => {
      // given
      const dispatch = jest.fn()
      const handleFail = jest.fn()
      const handleSuccess = jest.fn()

      // when
      mapDispatchToProps(dispatch).requestGetBookings(handleFail, handleSuccess)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        config: {
          apiPath: '/bookings',
          handleFail: expect.any(Function),
          handleSuccess: expect.any(Function),
          method: 'GET',
          normalizer: myBookingsNormalizer,
        },
        type: 'REQUEST_DATA_GET_/BOOKINGS',
      })
    })
  })
})
