import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Hamburguer } from '../components/Hamburguer'
import { Modal } from '../components/Modal'
import { logoutAction } from '../redux/actions/auth'

export const Navbar = () => {
  const navigate = useNavigate();
  const { first_name, last_name } = useSelector(state => state.authReducer);
  const dispatch = useDispatch()
  const [seeModal, setseeModal] = useState(false)

  const closeModal = () => {
    setseeModal(false);
  }

  const handleLogout = () => {
    setseeModal(true)
  }
  const handleOk = () => {
    dispatch(logoutAction())
    navigate('/login');
  }
  return (
      <>
        <div className='nav-container'>
            <nav>
                <Hamburguer />
            <p className='logo'>Overview</p>   
            <div className="user-info">
              <p>{first_name} {last_name}</p>
              <div className="dropdown">
                <button className="img-user dropbtn"></button>
                <div className="dropdown-content">
                    <a onClick={handleLogout}>Cerrar Sesion</a>
                    <a>Link 2</a>
                    <a>Link 3</a>
                </div>
                </div>
              </div>
            </nav>
            <Modal 
              handleClose={closeModal}
              showModal={seeModal}
              title="Cerar sesion"
              handleOk={handleOk}
              okText="Cerrar sesion"
              cancelText="Cancelar"
            >
              <p>estas seguro de querer cerrar sesion?</p>
            </Modal>
        </div>
      </>
  )
}
