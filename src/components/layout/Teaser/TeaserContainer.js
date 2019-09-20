import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import withTracking from '../../hocs/withTracking'
import Teaser from './Teaser'
import { isReserved, reservationStatuses } from './utils/statuses'
import { formatRecommendationDates } from '../../../utils/date/date'
import { getHumanizeRelativeDistance } from '../../../utils/geolocation'
import selectFirstMatchingBookingByOfferId from '../../../selectors/selectFirstMatchingBookingByOfferId'
import selectOfferById from '../../../selectors/selectOfferById'
import selectStockById from '../../../selectors/selectStockById'
import getHumanizeRelativeDate from '../../../utils/date/getHumanizeRelativeDate'

export const humanizeBeginningDateTime = (hasBookings, state, booking) => {
  let humanizeRelativeDate = ''

  if (hasBookings) {
    const stock = selectStockById(state, booking.stockId)
    humanizeRelativeDate = getHumanizeRelativeDate(stock.beginningDatetime)
  }

  return humanizeRelativeDate
}

export const mapStateToProps = (state, ownProps) => {
  const { handleToggleTeaser, item, isEditMode } = ownProps
  const { offerId, mediationId } = item
  const offer = selectOfferById(state, offerId)
  const { dateRange, isActive, isFinished, isFullyBooked, venue } = offer
  const booking = selectFirstMatchingBookingByOfferId(state, offerId)
  const isBooked = booking && !booking.isCancelled
  const hasBookings = booking !== null
  const humanizeRelativeDistance = getHumanizeRelativeDistance(
    state.geolocation.latitude,
    state.geolocation.longitude,
    venue.latitude,
    venue.longitude
  )
  const { pathname, search } = location
  const stringifiedMediationId = mediationId ? `/${mediationId}` : ''
  const detailsUrl = `${pathname}/details/${offer.id}${stringifiedMediationId}${search}`
  const humanizeRelativeDate = humanizeBeginningDateTime(hasBookings, state, booking)
  const statuses = reservationStatuses(
    isActive,
    isFinished,
    isFullyBooked,
    hasBookings,
    humanizeRelativeDate,
    isBooked
  )
  const date = isReserved(statuses)
    ? formatRecommendationDates(venue.departementCode, dateRange)
    : null

  return {
    date,
    detailsUrl,
    handleToggleTeaser,
    humanizeRelativeDistance,
    isEditMode,
    name: offer.name,
    offerId,
    offerTypeLabel: offer.offerType.appLabel,
    statuses,
    thumbUrl: item.thumbUrl,
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { offerId } = stateProps
  return {
    ...stateProps,
    trackConsultOffer: () => {
      ownProps.tracking.trackEvent({ action: 'consultOffer', name: offerId })
    },
  }
}

export default compose(
  withRouter,
  withTracking('Offer'),
  connect(
    mapStateToProps,
    {},
    mergeProps
  )
)(Teaser)
