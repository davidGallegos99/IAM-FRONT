import React, { useEffect,useState } from 'react'
import { Table } from '../components/Table'
import '../styles/usuario.css'
import EditIcon from '../assets/icons/editicon.svg'
import DeleteIcon from '../assets/icons/deleteicon.svg'
import ActiveIcon from '../assets/icons/active.svg'
import InactiveIcon from '../assets/icons/inactive.svg'
import PlusIcon from '../assets/icons/plus.svg'
import { UseFetch } from '../hooks/UseFetch'
import { Modal } from '../components/Modal'
import { UsersForm } from '../components/forms/UsersForm'
import { Toast } from '../components/Toast'

export const Usuarios = () => {
    const [reqUsuarios, fetchUsuarios] = UseFetch();
    const [usuarios, setusuarios] = useState([]);
    const [pagination, setpagination] = useState({});   
    const [skip, setskip] = useState(0);
    const [limit, setlimit] = useState(10);
    const [roles, getRoles] = UseFetch()
    const [rolesData, setrolesData] = useState([])
    const [showModal, setshowModal] = useState(false)
    const [reqSaveUser, setreqSaveUser] = UseFetch()
    const [mensaje, setmensaje] = useState('')
    const [type, settype] = useState('')
    

    const columns = [
        {
            name:'Nombre',
            dataIndex:'first_name'
        },
        {
            name:'apellido',
            dataIndex:'last_name'
        },
        {
            name:'Correo',
            dataIndex:'email'
        },
        {
            name:'Rol',
            dataIndex:(record)=> (
                <p>{record.Roles.name}</p>
            )
        },
        {
            name:'Estado',
            dataIndex: (record)=> (
                <>
                    {record.state ? <img src={ActiveIcon} alt="active" /> : <img src={InactiveIcon} alt="inactive" />}
                </>
            )
        },
        {
            name:'Acciones',
            dataIndex:(record)=>(
                <Actions record={record} />
            )
        }
    ]

    const onFinish = (values) => {
        setreqSaveUser({
            url:'/usuario/register',
            method:'post',
            body:values
        })    }

    const closeModal = () => {
        setshowModal(false)
    }

   
    const prevPage = () => {
        setskip(skip-limit);
    }
    
    const nextPage = () => {
        setskip(skip+limit);
    }
    useEffect(()=> {
        getRoles({
            url:'/roles/all',
            method:'get'
        })
    },[])

    useEffect(()=> {
        if(!reqSaveUser.loading && reqSaveUser.data?.registered) {
            setshowModal(false)
            settype('success')
            setmensaje('Usuario registrado, se envio un correo de cambio de contraseña.')
            setTimeout(() => {
                settype('')
                setmensaje('')
            }, 4000);
        }
        if(!reqSaveUser.loading && reqSaveUser.data && !reqSaveUser.data?.registered && !reqSaveUser.data?.exists) {
            setshowModal(false)
            settype('error')
            setmensaje('No se pudo registrar este usuario, intentelo de nuevo mas tarde')
            setTimeout(() => {
                settype('')
                setmensaje('')
            }, 4000);
        }
        if(!reqSaveUser.loading && reqSaveUser.data?.exists) {
            setshowModal(false)
            settype('error')
            setmensaje('Este usuario ya se encuentra registrado')
            setTimeout(() => {
                settype('')
                setmensaje('')
            }, 4000);
        }
        
    },[reqSaveUser.loading, reqSaveUser.error])

    useEffect(()=> {
        if(!roles.loading && roles.data?.data) {
            setrolesData(roles.data.data)
        }
    },[roles.loading, roles.error])

    useEffect(()=> {
        fetchUsuarios({
            url:`/usuario?skip=${skip}&limit=${limit}`,
            method:'get',
        })
    }, [skip])

    useEffect(()=> {
        if(!reqUsuarios.loading && reqUsuarios.data) {
            setusuarios(reqUsuarios.data.data[0]);
            setpagination({
                totalRecords:reqUsuarios.data.data[1],
                skip,
                limit,
                handlePrev:prevPage,
                handleNext: nextPage
            })
        }
    },[reqUsuarios.loading, reqUsuarios.error])

    const Actions = ({record}) => (
        <div className='actions'>
            <img src={EditIcon} onClick={()=>console.log(record)} />
            <img src={DeleteIcon} onClick={()=>console.log(record)} />
        </div>
    )

  return (
    <div className='contenedor'>
        <h1 className='user-title'>Usuarios</h1>
        {
            mensaje && (
                <div style={{marginTop:'2rem'}} className='login-message-container'>
                    <Toast 
                        type={type}
                        key="toast"
                    >{mensaje}</Toast>
                </div>
            )
        }
        <Table
            columns={columns}
            data={usuarios}
            showButton={true}
            textButton="Add User"
            iconButton={PlusIcon}
            header={true}
            pagination={pagination}
            loading={reqUsuarios.loading}
            clickButton={()=>setshowModal(true)}
        />
        <Modal 
              handleClose={closeModal}
              showModal={showModal}
              title= "Agregar usuario"
              okText="Registrar"
              cancelText="Cancelar"
              hideFooter={true}
        >
            <UsersForm
                loading={reqSaveUser.loading}
                roles={rolesData}
                onFinish={onFinish}
            />
        </Modal>

    </div>
  )
}
