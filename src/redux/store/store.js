import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { authReducer } from '../reducers/authReducer';
import storage from 'redux-persist/lib/storage'
import { 
    persistStore,
    persistReducer,
   } from 'redux-persist'
import { uiReducer } from '../reducers/ui';
import { permisosReducer } from '../reducers/permisosReducer';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const reducers = combineReducers({
    authReducer: authReducer,
    uiReducer: uiReducer,
    permisosReducer: permisosReducer
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['permisosReducer']
};
const persistedReducer = persistReducer(persistConfig, reducers); 

let store =  createStore(
      persistedReducer,
      composeEnhancers(
          applyMiddleware(thunk)
      )
  );
  let persistor = persistStore(store);
  let  pers = {store, persistor};
export default  pers
 