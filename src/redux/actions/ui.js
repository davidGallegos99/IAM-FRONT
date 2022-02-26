import { types } from "../types"

export const setError = (err) => {
    return {
        type: types.setError,
        payload:err
    }
}

export const removeError = () => {
    return {
        type: types.uiRemoveError,
    }
}

export const setMessage = (msg) => {
    return {
        type: types.setMessage,
        payload: msg
    }
}

export const removeSuccessMessage = () => {
    return {
        type: types.uiRemoveSuccessMsg
    }
}