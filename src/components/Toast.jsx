import React from 'react'
import { getIcon } from '../helpers/utils'

export const Toast = ({
    children,
    type
}) => {
  return (
        <div className="toast-container">
            <div className="toast-message">
                <img className='toast-icon' src={getIcon(type)} alt="toast-icon" />
                <p>{children}</p>
            </div>
        </div>
    )
}
