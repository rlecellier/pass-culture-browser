import { combineReducers } from 'redux'
import currentUser from './currentUser'
import data from './data'
import geolocation from './geolocation'
import overlay from './overlay'
import pagination from './pagination'
import share from './share'
import splash from './splash'
import token from './token'
import maintenance from './maintenance'
import lastRecommendationsRequestTimestamp from './lastRecommendationRequestTimestamp'

const rootReducer = combineReducers({
  currentUser,
  data,
  geolocation,
  lastRecommendationsRequestTimestamp,
  maintenance,
  overlay,
  pagination,
  share,
  splash,
  token,
})

export default rootReducer
