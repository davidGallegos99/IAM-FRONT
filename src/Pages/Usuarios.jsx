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

export const Usuarios = () => {
    const [reqUsuarios, fetchUsuarios] = UseFetch();
    const [usuarios, setusuarios] = useState([]);
    const [pagination, setpagination] = useState({});   
    const [skip, setskip] = useState(0);
    const [limit, setlimit] = useState(10);

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

   
    const prevPage = () => {
        setskip(skip-limit);
    }
    
    const nextPage = () => {
        setskip(skip+limit);
    }

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
        <Table
            columns={columns}
            data={usuarios}
            showButton={true}
            textButton="Add User"
            iconButton={PlusIcon}
            header={true}
            pagination={pagination}
            loading={reqUsuarios.loading}
        />
        
    </div>
  )
}
