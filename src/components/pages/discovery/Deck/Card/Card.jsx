import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import isDetailsView from '../../../../../utils/isDetailsView'
import RectoContainer from '../../../../layout/Recto/RectoContainer'
import VersoContainer from '../../../../layout/Verso/VersoContainer'

class Card extends PureComponent {
  componentDidMount() {
    const {
      handleReadRecommendation,
      handleSeenOffer,
      isSeenOfferFeatureActive,
      position,
      recommendation,
      seenOffer,
    } = this.props

    const isCurrentCardWithRecommendation = recommendation && position === 'current'
    if (isCurrentCardWithRecommendation && isSeenOfferFeatureActive) {
      handleSeenOffer(seenOffer)
    }

    const isFirstHasJustBeenRead = position === 'previous'
    if (isFirstHasJustBeenRead) {
      handleReadRecommendation(recommendation)
    }
  }

  componentDidUpdate(prevProps) {
    const {
      handleClickRecommendation,
      handleReadRecommendation,
      handleSeenOffer,
      isSeenOfferFeatureActive,
      match,
      recommendation,
      position,
      seenOffer,
    } = this.props
    const areDetailsNowVisible = isDetailsView(match) && !isDetailsView(prevProps.match)

    const isCurrent = recommendation && position === 'current'
    const hasJustBeenRead =
      position === 'current' &&
      (recommendation && recommendation.id) !==
        (prevProps.recommendation && prevProps.recommendation.id)

    if (hasJustBeenRead) {
      handleReadRecommendation(recommendation)
      if (isSeenOfferFeatureActive) {
        handleSeenOffer(seenOffer)
      }
    }

    if (!isCurrent) return

    const shouldRequest = areDetailsNowVisible && !recommendation.isClicked
    if (!shouldRequest) return

    handleClickRecommendation(recommendation)
  }

  render() {
    const { match, position, recommendation, width } = this.props
    const { index } = recommendation || {}
    const areDetails = isDetailsView(match)
    const isCurrent = position === 'current'
    const translateTo = index * width

    return (
      <div
        className={`card ${isCurrent ? 'current' : ''}`}
        style={{ transform: `translate(${translateTo}px, 0)` }}
      >
        {recommendation && isCurrent && <VersoContainer areDetailsVisible={areDetails} />}
        {recommendation && (
          <RectoContainer
            areDetailsVisible={areDetails}
            recommendation={recommendation}
          />
        )}
      </div>
    )
  }
}

Card.defaultProps = {
  recommendation: null,
}

Card.propTypes = {
  handleClickRecommendation: PropTypes.func.isRequired,
  handleReadRecommendation: PropTypes.func.isRequired,
  handleSeenOffer: PropTypes.func.isRequired,
  isSeenOfferFeatureActive: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      details: PropTypes.string,
    }).isRequired,
  }).isRequired,
  position: PropTypes.string.isRequired,
  recommendation: PropTypes.shape(),
  seenOffer: PropTypes.shape().isRequired,
  width: PropTypes.number.isRequired,
}

export default Card
