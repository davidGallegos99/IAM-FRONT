import { types } from "../types";

export const authReducer = (state = {} , action) => {
    switch (action.type) {
        
        case types.login:
            return {
                email:action.payload.email,
                _id:action.payload._id,
                first_name:action.payload.first_name,
                last_name:action.payload.last_name,
                token: action.payload.token,
                refreshToken:action.payload.refreshToken,
                rol:action.payload.rol
            }
        case types.logout:
            return {}
        default:
            return state;
    }
}