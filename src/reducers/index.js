import { combineReducers } from 'redux'
import data, {lastRecommendationsRequestTimestamp} from './data'
import geolocation from './geolocation'
import menu from './menu'
import overlay from './overlay'
import pagination from './pagination'
import share from './share'
import splash from './splash'
import token from './token'
import maintenanceReducer from './maintenanceReducer'
import seenOffers from './seenOffers'

const rootReducer = combineReducers({
  data,
  geolocation,
  lastRecommendationsRequestTimestamp,
  maintenance: maintenanceReducer,
  seenOffers,
  menu,
  overlay,
  pagination,
  share,
  splash,
  token,
})

export default rootReducer
