import { types } from "../types";

export const uiReducer = (state={}, action) => {
    switch (action.type) {
        case types.setError:
            return {
                ...state,
                msgError:action.payload
            }
        case types.uiRemoveError:
            return {
                ...state,
                msgError: null
            }
        case types.setMessage:
            return{
                ...state,
                successMsg:action.payload
            }
        case types.uiRemoveSuccessMsg: 
        return {
            ...state,
            successMsg:null
        }
        default:
            return state;
    }
}