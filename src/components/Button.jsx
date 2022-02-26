import React from 'react'
import '../styles/buttons.css'
import PlusIcon from '../assets/icons/plus.svg'

export const Button = ({background,color, icon, children, onclick}) => {
  return (
    <button 
      onClick={onclick}
        className='button'
        style={{color:color,background}}
    >{icon && (<img style={{objectFit:'contain'}} src={icon} alt="icon-button" />)}{children}</button>
  )
}
