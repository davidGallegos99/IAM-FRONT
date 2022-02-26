import { types } from "../types"

export const setPermisosAction = (permisos) => {
    
    return {
        type: types.setPermisos,
        payload: {
            permisos
        }
    }
}