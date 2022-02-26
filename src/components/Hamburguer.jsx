import React, { useRef } from 'react'

export const Hamburguer = () => {
  const hamburguesa = useRef(null)
  const handleClick = () => {
    console.log(hamburguesa.current);
    hamburguesa.current.classList.toggle('open');
    document.getElementById('sidebar').classList.toggle('abrir')
  }
  return (
    <div className='hamburguer'>
        <button
          ref={hamburguesa}
          onClick={handleClick}
        >
            <span className='top-line'></span>
            <span className='middle-line'></span>
            <span className='bottom-line'></span>
        </button>
    </div>
  )
}
