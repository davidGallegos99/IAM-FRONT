import React, { useEffect, useState } from 'react'
import { Table } from '../components/Table'
import '../styles/usuario.css'
import DeleteIcon from '../assets/icons/deleteicon.svg'
import ActiveIcon from '../assets/icons/active.svg'
import InactiveIcon from '../assets/icons/inactive.svg'
import PlusIcon from '../assets/icons/plus.svg'
import { UseFetch } from '../hooks/UseFetch'
import '../styles/permisos.css'
import { Modal } from '../components/Modal'
import { Toast } from '../components/Toast'
import { AccionesForm } from '../components/forms/AccionesForm'


export const Acciones = () => {
    const [reqAcciones, fetchAcciones] = UseFetch();
    const [usuarios, setusuarios] = useState([]);
    const [pagination, setpagination] = useState({});   
    const [skip, setskip] = useState(0);
    const [limit, setlimit] = useState(10);
    const [seeModal, setseeModal] = useState(false);
    const [reqSaveAction, setreqSaveAction] = UseFetch();
    const [mensaje, setmensaje] = useState('');
    const [type, settype] = useState('')
    const [record, setRecord] = useState(null)
    const [showDeleteModal, setshowDeleteModal] = useState(false)
    const [deleteAction, setdeleteAction] = UseFetch()

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
        setreqSaveAction({
            url:'/acciones',
            method:'post',
            body:values
        })
    }

    const handleDelete = () => {
        setdeleteAction({
            url:`/acciones/${record._id}`,
            method:'delete'
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
        fetchAcciones({
            url:`/acciones?skip=${skip}&limit=${limit}`,
            method:'get',
        })
    }, [skip])


    useEffect(()=> {
        if(!deleteAction.loading && deleteAction.data?.deleted) {
            setshowDeleteModal(false)
            settype('success');
            setmensaje(deleteAction.data.message);
            fetchAcciones({
                url:`/acciones?skip=${skip}&limit=${limit}`,
                method:'get',
            })
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return            
        }
    },[deleteAction.loading, deleteAction.error]) 

    useEffect(()=> {
        if(reqSaveAction.data?.added && !reqSaveAction.loading){
            setseeModal(false)
            settype('success');
            setmensaje('Accion ingresada correctamente.');
            fetchAcciones({
                url:`/acciones?skip=${skip}&limit=${limit}`,
                method:'get',
            })
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
        if(reqSaveAction.data?.exists && !reqSaveAction.loading) {
            setseeModal(false)
            settype('error');
            setmensaje('Ya existe un permiso con esta ruta.');
            setTimeout(() => {
                setmensaje('');
                settype('');
            }, 5000);
            return
        }
        if(!reqSaveAction.data?.added && reqSaveAction.error) {
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
    }, [reqSaveAction.loading, reqSaveAction.data, reqSaveAction.error])

    useEffect(()=> {
        if(!reqAcciones.loading && reqAcciones.data) {
            setusuarios(reqAcciones.data.data[0]);
            setpagination({
                totalRecords:reqAcciones.data.data[1],
                skip,
                limit,
                handlePrev:prevPage,
                handleNext: nextPage
            })
        }
    },[reqAcciones.loading, reqAcciones.error])

    const Actions = ({record}) => (
        <div className='actions'>
            <img src={DeleteIcon} onClick={()=>{
                setRecord(record);
                setshowDeleteModal(true)
            }} />
        </div>
    )

  return (
    <div className='contenedor'>
        <h1 className='permisos-title'>Acciones</h1>
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
            textButton="Agregar accion"
            iconButton={PlusIcon}
            header={true}
            pagination={pagination}
            loading={reqAcciones.loading}
            clickButton={handleClickTable}
        />
        <Modal 
              handleClose={closeModal}
              showModal={seeModal}
              title="Nueva accion"
              okText="Crear"
              cancelText="Cancelar"
              hideFooter={true}
        >
            <AccionesForm
                loading={reqSaveAction.loading}
                onFinish={onFinish}
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
