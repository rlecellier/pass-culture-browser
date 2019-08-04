import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-saga-data'

import VersoContentOffer from './VersoContentOffer'
import selectMusicTypeByCode from './selectors/selectMusicTypeByCode'
import selectMusicSubTypeByCodeAndSubCode from './selectors/selectMusicSubTypeByCodeAndSubCode'
import selectShowTypeByCode from './selectors/selectShowTypeByCode'
import selectShowSubTypeByCodeAndSubCode from './selectors/selectShowSubTypeByCodeAndSubCode'
import selectBookables from '../../../../../selectors/selectBookables'
import selectBookingByMatch from '../../../../../selectors/selectBookingByMatch'
import selectDistanceByMatch from '../../../../../selectors/selectDistanceByMatch'
import selectIsFinishedByMatch from '../../../../../selectors/selectIsFinishedByMatch'
import selectOfferByMatch from '../../../../../selectors/selectOfferByMatch'

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const offer = selectOfferByMatch(state, match) || {}
  const bookables = selectBookables(state, offer)
  const isFinished = selectIsFinishedByMatch(state, match)

  const { product } = offer || {}
  const { extraData } = product || {}
  const {
    musicSubType: musicSubCode,
    musicType: musicCode,
    showSubType: showSubCode,
    showType: showCode
  } = extraData || {}
  const musicType = selectMusicTypeByCode(state, musicCode)
  const showType = selectShowTypeByCode(state, showCode)
  const musicSubType = selectMusicSubTypeByCodeAndSubCode(
    state,
    musicCode,
    musicSubCode
  )
  const showSubType = selectShowSubTypeByCodeAndSubCode(
    state,
    showCode,
    showSubCode
  )

  const { data: { musicTypes, showTypes } } = state

  const booking = selectBookingByMatch(state, match)

  const distance = selectDistanceByMatch(state, match)

  return {
    bookables,
    booking,
    distance,
    isFinished,
    musicSubType,
    musicType,
    musicTypes,
    offer,
    showSubType,
    showType,
    showTypes,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { musicTypes, showTypes } = ownProps
  return {
    handleRequestMusicAndShowTypes: () => {
      if (!musicTypes) {
        dispatch(
          requestData({
            apiPath: '/musicTypes',
          })
        )
      }
      if (!showTypes) {
        dispatch(
          requestData({
            apiPath: '/showTypes',
          })
        )
      }
    },
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(VersoContentOffer)