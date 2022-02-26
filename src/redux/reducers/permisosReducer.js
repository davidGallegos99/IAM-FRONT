import { types } from "../types";

export const permisosReducer = (state = {} , action) => {
    switch (action.type) {
        
        case types.setPermisos:
            console.log('permisos >>>>>>>>>>>>>>>>> ',action.payload.permisos);
            return {
                ...state,
                permisos:action.payload.permisos
            }
        
        default:
            return state;
    }
}