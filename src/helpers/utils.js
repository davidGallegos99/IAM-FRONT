import SuccessIcon from '../assets/icons/success.svg'
import InfoIcon from '../assets/icons/inIcon.svg'
import ErrorIcon from '../assets/icons/error.svg'


export const generarId = () => {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36);
    return random + fecha;
}

export const formaterFecha = fecha => {
    const fechaNueva = new Date(fecha)
    const opciones = {year:'numeric', month:'long',day:'2-digit'}
     return fechaNueva.toLocaleString('es-ES', opciones)
}

export const getIcon = (key) => {
    const icons = {
        success: SuccessIcon,
        info: InfoIcon,
        error: ErrorIcon
    }
    return icons[key];
}
