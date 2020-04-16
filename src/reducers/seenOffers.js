const initialState = []
export const EDIT_SEEN_OFFERS = 'EDIT_SEEN_OFFERS'

//REDUCER
export const seenOffers = (state = initialState, action) => {
  const { type: actionType } = action
  if (actionType === EDIT_SEEN_OFFERS) {
    state.push({
      offerId: action.offerId,
      userId: action.userId,
      dateSeen: action.dateSeen,
    })
    return state
  }
  return state
}

// ACTION CREATOR
export function editSeenOffers({ offerId, userId, dateSeen }) {
  return { offerId, userId, dateSeen, type: EDIT_SEEN_OFFERS }
}

export default seenOffers
