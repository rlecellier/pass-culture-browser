const initialState = []
const EDIT_SEEN_OFFERS = 'EDIT_SEEN_OFFERS'
export const seenOffers = (state = initialState, action) => {
  const { type: actionType } = action
  if (actionType === EDIT_SEEN_OFFERS) {
    state.push({
      offerId: action.offerId,
      userId: action.userId,
      dateSeen: action.dateSeen
    })
    return state
    }
  return state
}

export function editSeenOffers({ offerId, userId, dateSeen }) {
  return { offerId, userId, dateSeen, type: EDIT_SEEN_OFFERS }
}

export default seenOffers
