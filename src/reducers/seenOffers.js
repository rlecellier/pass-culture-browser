import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'

const initialState = {seenOffers: []}
export const EDIT_SEEN_OFFERS = 'EDIT_SEEN_OFFERS'

//REDUCER
export const seenOffersReducer = (state = initialState, action) => {
  const { type: actionType } = action
  if (actionType === EDIT_SEEN_OFFERS) {
    state.seenOffers.push({
      offerId: action.offerId,
      userId: action.userId,
      dateSeen: action.dateSeen,
    })
    console.log('--------')
    console.log(state)
    return state
  }
  return state
}
const dataPersistConfig = {
  key: 'passculture-webapp-seenOffers',
  storage,
  whitelist: ['seenOffers']
}
const persistDataReducer = persistReducer(dataPersistConfig, seenOffersReducer)

// ACTION CREATOR
export function editSeenOffers({ offerId, userId, dateSeen }) {
  return { offerId, userId, dateSeen, type: EDIT_SEEN_OFFERS }
}

export default persistDataReducer
