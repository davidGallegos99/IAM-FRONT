import React, { useEffect, useState } from 'react'
import { Table } from '../components/Table'
import '../styles/usuario.css'
import EditIcon from '../assets/icons/editicon.svg'
import DeleteIcon from '../assets/icons/deleteicon.svg'
import ActiveIcon from '../assets/icons/active.svg'
import InactiveIcon from '../assets/icons/inactive.svg'
import PlusIcon from '../assets/icons/plus.svg'
import { UseFetch } from '../hooks/UseFetch'
import '../styles/permisos.css'
import { Modal } from '../components/Modal'
import { PermisosForm } from '../components/forms/PermisosForm'
import { Toast } from '../components/Toast'

export const Permisos = () => {
    const [reqPermisos, fetchPermisos] = UseFetch();
    const [usuarios, setusuarios] = useState([]);
    const [pagination, setpagination] = useState({});   
    const [skip, setskip] = useState(0);
    const [limit, setlimit] = useState(10);
    const [seeModal, setseeModal] = useState(false);
    const [reqSavePerm, setReqSavePerm] = UseFetch();
    const [mensaje, setmensaje] = useState('');
    const [type, settype] = useState('')
    const [acciones, setAcciones] = useState([]);
    const [reqAcciones, setreqAcciones] = UseFetch();
    const [record, setRecord] = useState(null)
    const [action, setaction] = useState('')
    const [deletePerm, setdeletePerm] = UseFetch()
    const [showDeleteModal, setshowDeleteModal] = useState(false)

    const columns = [
        {
            name:'Nombre',
            dataIndex:'name'
        },
        {
            name:'Ruta',
            dataIndex:'path'
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
        if(action == 'add') {
            setReqSavePerm({
                url:'/permisos',
                method:'post',
                body:values
            })
        }

        if(action == 'edit') {
            setReqSavePerm({
                url:`/permisos/${record._id}`,
                method:'put',
                body:values
            })
        }
    }

    

    const handleClickTable = () => {
        setaction('add')
        setRecord(null);
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
        setreqAcciones({
            method:'get',
            url:'/acciones/all'
        })
      }, [])

    useEffect(()=> {
        fetchPermisos({
            url:`/permisos?skip=${skip}&limit=${limit}`,
            method:'get',
        })
    }, [skip])

    useEffect(()=> {
        if(reqSavePerm.data?.added && !reqSavePerm.loading){
            setseeModal(false)
            settype('success');
            setmensaje(reqSavePerm.data.message);
            fetchPermisos({
                url:`/permisos?skip=${skip}&limit=${limit}`,
                method:'get',
            })
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
        if(reqSavePerm.data?.exists && !reqSavePerm.loading) {
            setseeModal(false)
            settype('error');
            setmensaje('Ya existe un permiso con esta ruta.');
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
        if(!reqSavePerm.data?.added && reqSavePerm.error) {
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
    }, [reqSavePerm.loading, reqSavePerm.data, reqSavePerm.error])

    useEffect(()=> {
        if(!reqPermisos.loading && reqPermisos.data) {
            setusuarios(reqPermisos.data.data[0]);
            setpagination({
                totalRecords:reqPermisos.data.data[1],
                skip,
                limit,
                handlePrev:prevPage,
                handleNext: nextPage
            })
        }
    },[reqPermisos.loading, reqPermisos.error])

    useEffect(()=> {
        if(!reqAcciones.loading && reqAcciones.data) {
            setAcciones(reqAcciones.data.data);
            
        }
    },[reqAcciones.loading, reqAcciones.error])    

    useEffect(()=> {
        if(!deletePerm.loading && deletePerm.data?.deleted) {
            setshowDeleteModal(false)
            settype('success');
            setmensaje(deletePerm.data.message);
            fetchPermisos({
                url:`/permisos?skip=${skip}&limit=${limit}`,
                method:'get',
            })
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return            
        }
    },[deletePerm.loading, deletePerm.error])  


    const handleDelete = () => {
        setdeletePerm({
            url:`/permisos/${record._id}`,
            method:'delete'
        })
    }
    const Actions = ({record}) => (
        <div className='actions'>
            <img src={EditIcon} onClick={()=>{
                setRecord(record);
                setaction('edit');
                setseeModal(true);
            }} />
            <img src={DeleteIcon} onClick={()=>{
                setRecord(record);
                setshowDeleteModal(true)
            }} />
        </div>
    )

  return (
    <div className='contenedor'>
        <h1 className='permisos-title'>Permisos</h1>
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
            textButton="Agregar permiso"
            iconButton={PlusIcon}
            header={true}
            pagination={pagination}
            loading={reqPermisos.loading}
            clickButton={handleClickTable}
        />
        <Modal 
              handleClose={closeModal}
              showModal={seeModal}
              title= {action == 'add' ? 'Nuevo permiso' : action == 'edit' ? 'Editar permiso' : ''}
              okText={action == 'add' ? 'Crear' : action == 'edit' ? 'Editar' : ''}
              cancelText="Cancelar"
              hideFooter={true}
        >
            <PermisosForm
                acciones={acciones}
                loading={reqSavePerm.loading}
                onFinish={onFinish}
                dataEdit={record}

            />
        </Modal>

        <Modal
            handleClose={()=>setshowDeleteModal(false)}
            showModal={showDeleteModal}
            title='Eliminar permiso'
            okText='Eliminar'
            cancelText="Cancelar"
            handleOk={handleDelete}
        >
            <p>Estas seguro de eliminar este permiso?</p>
        </Modal>
    </div>
  )
}
