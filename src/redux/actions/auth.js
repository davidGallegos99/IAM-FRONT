import { types } from "../types";

export const loginAction = (user) => ({
    type: types.login,
    payload: {
        email:user.email,
        _id:user._id,
        first_name:user.first_name,
        last_name:user.last_name,
        token: user.token,
        refreshToken:user.refreshToken,
        rol:user.rol
    }
})

export const logoutAction = () => ({
    type:types.logout
})