import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Price from '../../../../Price'
import getIsCancelling from '../../../../../../helpers/getIsCancelling'

class CancelThisLink extends PureComponent {
  componentDidMount () {
    const { booking, match, offer, openCancelPopin } = this.props
    const { id: bookingId } = booking || {}
    const { name: offerName } = offer || {}
    const isCancelling = getIsCancelling(match)
    if (isCancelling) {
      openCancelPopin(bookingId, offerName)
    }
  }

  componentDidUpdate (prevProps) {
    const { booking, match, offer, openCancelPopin } = this.props
    const { id: bookingId } = booking || {}
    const { name: offerName } = offer || {}
    const isCancelling = getIsCancelling(match)
    const previousIsCancelling = getIsCancelling(prevProps.match)
    if (isCancelling && !previousIsCancelling) {
      openCancelPopin(bookingId, offerName)
    }
  }

  handleOnClick = () => {
    const {
      booking,
      history,
      location,
      match: { params },
      isFinished,
    } = this.props
    const { pathname, search } = location
    const { id: bookingId } = booking
    if (isFinished || params.cancellation) {
      return
    }
    let bookingUrl = pathname
    if (!params.bookings) {
      bookingUrl = `${bookingUrl}/reservations`
    }
    if (params.bookingId !== bookingId) {
      bookingUrl = `${bookingUrl}/${bookingId}`
    }
    bookingUrl = `${bookingUrl}/annulation${search}`
    history.push(bookingUrl)
  }

  render() {
    const { booking, isFinished } = this.props
    const { isCancelled, stock } = booking || {}
    const { price } = stock || {}
    return (
      <button
        className="flex-columns no-border no-background"
        disabled={isFinished}
        id="verso-cancel-booking-button"
        onClick={this.handleOnClick}
        type="button"
      >
        <span className="pc-ticket-button-price reserved">
          <Price
            free="Gratuit"
            value={price}
          />
          {!isCancelled && (
            <i
              className="icon-ico-check fs24"
              id="verso-cancel-booking-button-reserved"
            />
          )}
        </span>
        <span className="pc-ticket-button-label">{'Annuler'}</span>
      </button>
    )
  }
}

CancelThisLink.defaultProps = {
  isFinished: false
}

CancelThisLink.propTypes = {
  booking: PropTypes.shape().isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isFinished: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      bookings: PropTypes.string,
      bookingId: PropTypes.string,
      cancellation: PropTypes.string
    }).isRequired
  }).isRequired,
  offer: PropTypes.shape().isRequired,
  openCancelPopin: PropTypes.func.isRequired
}

export default CancelThisLink