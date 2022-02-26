import React, { useEffect, useState } from 'react'
import '../styles/modal.css'
import CloseIcon from '../assets/icons/close.svg'
import { Button } from './Button'

export const Modal = ({
    showModal,
    handleClose,
    title,
    handleOk,
    children,
    okText,
    cancelText,
    hideFooter,
}) => {
    
    useEffect(() => {
      
    }, [])

  return (
      <>
      {
          showModal && (
            <div className='modal'>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>{title}</h4>
                        <img onClick={handleClose} src={CloseIcon} alt="" />
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    {
                        !hideFooter && (
                            <div className="modal-footer">
                                <Button 
                                    color="var(--white)" 
                                    background="#a7a7a7"
                                >{cancelText}</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button 
                                    onclick={handleOk}
                                    color="var(--white)" 
                                    background="var(--primary)"
                                >{okText}</Button>
                            </div>
                        )
                    }
                </div>
            </div>
          )
      }
      </>
  )
}
