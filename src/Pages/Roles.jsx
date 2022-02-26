import React, { useEffect } from 'react'
import { Table } from '../components/Table'
import '../styles/usuario.css'
import EditIcon from '../assets/icons/editicon.svg'
import DeleteIcon from '../assets/icons/deleteicon.svg'
import ActiveIcon from '../assets/icons/active.svg'
import InactiveIcon from '../assets/icons/inactive.svg'
import PlusIcon from '../assets/icons/plus.svg'
import { UseFetch } from '../hooks/UseFetch'
import { useState } from 'react/cjs/react.development'
import '../styles/permisos.css'
import { Modal } from '../components/Modal'
import { Toast } from '../components/Toast'
import { RolesForm } from '../components/forms/RolesForm'
import { Tabs } from '../components/Tabs'
import { AssignRoles } from '../components/AssignRoles'
import { ArrowLeftOutlined } from '@ant-design/icons/lib/icons'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'



export const Roles = () => {
    const [reqRoles, fetchRoles] = UseFetch();
    const [roles, setroles] = useState([]);
    const [pagination, setpagination] = useState({});   
    const [skip, setskip] = useState(0);
    const [limit, setlimit] = useState(10);
    const [seeModal, setseeModal] = useState(false);
    const [reqSaveRole, setreqSaveRole] = UseFetch();
    const [mensaje, setmensaje] = useState('');
    const [type, settype] = useState('')
    const [showTab, setshowTab] = useState(false)
    const uiReducer  = useSelector(state => state.uiReducer)


    const columns = [
        {
            name:'Nombre',
            dataIndex:'name'
        },
        {
            name:'Descripcion',
            dataIndex:'description'
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
        console.log(values);
        setreqSaveRole({
            url:'/roles',
            method:'post',
            body:values
        })
    }

    

    const handleClickTable = () => {
        setseeModal(true)
    }

   
    const prevPage = () => {
        setskip(skip-limit);
    }
    
    const nextPage = () => {
        setskip(skip+limit);
    }

    const closeModal = () => {
        setseeModal(false);
      }

    useEffect(()=> {
        fetchRoles({
            url:`/roles?skip=${skip}&limit=${limit}`,
            method:'get',
        })
    }, [skip])

    useEffect(()=> {
        if(reqSaveRole.data?.added && !reqSaveRole.loading){
            setseeModal(false)
            settype('success');
            setmensaje('Rol ingresada correctamente.');
            fetchRoles({
                url:`/roles?skip=${skip}&limit=${limit}`,
                method:'get',
            })
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
        
        if(!reqSaveRole.data?.added && reqSaveRole.error) {
            debugger
            setseeModal(false)
            settype('error');
            setmensaje('Ha ocurrido un error al crear el permiso, intentelo mas tarde');
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
    }, [reqSaveRole.loading, reqSaveRole.data, reqSaveRole.error])

    useEffect(()=> {
        if(!reqRoles.loading && reqRoles.data) {
            setroles(reqRoles.data.data[0]);
            setpagination({
                totalRecords:reqRoles.data.data[1],
                skip,
                limit,
                handlePrev:prevPage,
                handleNext: nextPage
            })
        }
    },[reqRoles.loading, reqRoles.error])

    const Actions = ({record}) => (
        <div className='actions'>
            <img src={EditIcon} onClick={()=>setshowTab(true)} />
            <img src={DeleteIcon} onClick={()=>console.log(record)} />
        </div>
    )

  return (
    <div className='contenedor'>
        <h1 className='permisos-title'>Roles</h1>
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
        {
            uiReducer.successMsg && (
                <div style={{marginTop:'2rem'}} className='login-message-container'>
                    <Toast 
                        type='success'
                        key="toast"
                    >{uiReducer.successMsg}</Toast>
                </div>
            )
        }

        {
            !showTab ? (
                <>
                    <Table
                    columns={columns}
                    data={roles}
                    showButton={true}
                    textButton="Agregar rol"
                    iconButton={PlusIcon}
                    header={true}
                    pagination={pagination}
                    loading={reqRoles.loading}
                    clickButton={handleClickTable}
                />
                <Modal 
                    handleClose={closeModal}
                    showModal={seeModal}
                    title="Nuevo rol"
                    okText="Crear"
                    cancelText="Cancelar"
                    hideFooter={true}
                >
                    <RolesForm
                        loading={reqSaveRole.loading}
                        onFinish={onFinish}
                    />
                </Modal>
                </>
                
            ) : 
                <>
                <ArrowLeftOutlined onClick={()=>setshowTab(false)} style={{width:'90%',display:'flex'}}/>
                <Tabs columns={roles}>
                        <AssignRoles/>
                    </Tabs>
                </>
        }
        
    </div>
  )
}
