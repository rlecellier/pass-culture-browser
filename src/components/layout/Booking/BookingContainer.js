import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { requestData } from 'redux-thunk-data'

import { selectBookablesWithoutDateNotAvailable } from '../../../redux/selectors/data/stocksSelectors'
import { selectOfferByRouterMatch } from '../../../redux/selectors/data/offersSelectors'
import { selectRecommendationByRouterMatch } from '../../../redux/selectors/data/recommendationsSelectors'
import { bookingNormalizer } from '../../../utils/normalizers'
import withTracking from '../../hocs/withTracking'
import Booking from './Booking'

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const offer = selectOfferByRouterMatch(state, match)
  const bookables = selectBookablesWithoutDateNotAvailable(state, offer)
  const recommendation = selectRecommendationByRouterMatch(state, match)

  return {
    bookables,
    offer,
    recommendation,
  }
}

export const mapDispatchToProps = dispatch => ({
  handleSubmit: (payload, handleRequestFail, handleRequestSuccess) => {
    dispatch(
      requestData({
        apiPath: '/bookings',
        body: payload,
        handleFail: handleRequestFail,
        handleSuccess: handleRequestSuccess,
        method: 'POST',
        name: 'booking',
        normalizer: bookingNormalizer,
      })
    )
  },
})

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { history: { location: { pathname }}} = ownProps
  const basePath = pathname.match(/^\/([^\/]*)\//)[1]
  const { offer: { id: offerId } = {} } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    trackBookingSuccess: () => {
      ownProps.tracking.trackEvent({ action: `${basePath.toUpperCase()} - bookingOffer`, name: offerId })
    },
  }
}

export default compose(
  withRouter,
  withTracking('Offer'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(Booking)
