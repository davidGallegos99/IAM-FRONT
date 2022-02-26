import React from 'react'
import '../styles/navbar.css'
import DashIcon from '../assets/icons/dashboardicon.svg'
import Usericon from '../assets/icons/users.svg'
import Rolesicon from '../assets/icons/roles.svg'
import Permisosicon from '../assets/icons/permisos.svg'
import AccionesIcon from '../assets/icons/acciones.svg'
import { Link } from 'react-router-dom'

export const SideBar = () => {
  return (
    <div className='sidebar' id='sidebar'>
        <div className="sidebar-content">
            <div className="dashboard-icon">
                <img src={DashIcon} alt="dashboard" />
                <p>Dashboard</p>
            </div>
            <ul>
                <Link className='link' to="/usuarios" >
                    <li>
                        <img src={Usericon} alt="users" /> Usuarios
                    </li>
                </Link>

                <Link className='link' to="/roles" >
                    <li ><img src={Rolesicon} alt="roles" /> Roles</li>
                </Link>

                <Link className='link' to="/permisos" >
                    <li >
                        <img src={Permisosicon} alt="permisos" /> Permisos
                    </li>
                </Link>
                <Link className='link' to="/acciones" >
                    <li ><img src={AccionesIcon} alt="acciones" /> Acciones por pantalla</li>
                </Link>
            </ul>
        </div>
    </div>
  )
}
