import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withSizes from 'react-sizes'
import { compose } from 'redux'
import { mergeData, requestData } from 'redux-thunk-data'

import Card from './Card'
import { editSeenOffers } from '../../../../../reducers/seenOffers'
import { getRecommendationSelectorByCardPosition } from '../../utils/utils'
import { recommendationNormalizer } from '../../../../../utils/normalizers'
import { selectCurrentUser } from '../../../../../selectors/data/usersSelectors'

export const mapStateToProps = (state, ownProps) => {
  const { match, position } = ownProps
  const { params } = match
  const { mediationId, offerId } = params
  const recommendationSelector = getRecommendationSelectorByCardPosition(position)
  const recommendation = recommendationSelector(state, offerId, mediationId)
  const user = selectCurrentUser(state)
  const seenOffer = {
    offerId: offerId,
    userId: user.id,
  }
  return {
    recommendation,
    seenOffer,
  }
}

export const mapDispatchToProps = dispatch => ({
  handleClickRecommendation: recommendation => {
    dispatch(
      requestData({
        apiPath: `recommendations/${recommendation.id}`,
        body: { isClicked: true },
        method: 'PATCH',
        normalizer: recommendationNormalizer,
      })
    )
  },

  handleReadRecommendation: recommendation => {
    const readRecommendation = {
      dateRead: moment.utc().toISOString(),
      id: recommendation.id,
    }
    dispatch(
      mergeData({
        readRecommendations: [readRecommendation],
      })
    )
  },

  handleSeenOffer: seenOffer => {
    const newSeenOffer = {
      dateSeen: moment.utc().toISOString(),
      offerId: seenOffer.offerId,
      userId: seenOffer.userId,
    }
    dispatch(editSeenOffers(newSeenOffer))
  },
})

const mapSizeToProps = ({ width, height }) => ({
  height,
  width: Math.min(width, 500),
})

export default compose(
  withSizes(mapSizeToProps),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Card)
