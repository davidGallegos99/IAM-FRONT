import React, { useEffect, useState } from 'react'
import '../styles/AssignRoles.css'
import { Button } from './Button'
import IconEdit from '../assets/icons/whiteediticon.svg'
import { UseFetch } from '../hooks/UseFetch'
import { Spinner } from './Spinner'
import { Collapse, Form } from 'antd'
import { useDispatch } from 'react-redux'
import { removeSuccessMessage, setMessage } from '../redux/actions/ui'
import { setPermisosAction } from '../redux/actions/permisos'
import { useSelector } from 'react-redux'
const { Panel } = Collapse;

export const AssignRoles = ({
    data
}) => {
  const [form] =  Form.useForm();
  const [reqPermisos, setreqPermisos] = UseFetch();
  const [permisos, setpermisos] = useState([])
  const [permisosToStore, setPemisosToStore] = useState({})
  const [reqSavePermisos, setreqSavePermisos] = UseFetch()
  const [permisosByRol, fetchPermisosByRol] = UseFetch()
  const dispatch = useDispatch()
  const permisosRedux = useSelector(state => state.permisosReducer)


  useEffect(()=> {
    setreqPermisos({
      url:'/permisos/all',
      method:'get'
    })
    fetchPermisosByRol({
      url:`/roles_permisos/byRol/${data._id}`,
      method:'get'
    });
  }, [data])


  useEffect(()=> {
    if(!reqPermisos.loading && reqPermisos.data) {
        dispatch(setPermisosAction(reqPermisos.data.data))
        setpermisos(reqPermisos.data.data);
    }
  },[reqPermisos.loading, reqPermisos.error])

  const convertPermisos = () => {
    const lista = []
    Object.keys(permisosToStore).forEach(el => {
      lista.push({
        permiso: permisosToStore[el].split('-')[0],
        accion:permisosToStore[el].split('-')[1]
      })
    });
    let result = lista.reduce(function (r, a) {
      r[a.permiso] = r[a.permiso] || [];
      r[a.permiso].push(a.accion);
      return r;
  }, Object.create(null));
  
  result = Object.keys(result).map(el => {
    const objeto = {
      permiso:el,
      acciones:result[el]
    }
    return objeto
  });

  result = {
    rol:data._id,
    permisos:[...result]
  }
  return result
  }


  const handleClick = () => {
    const result = convertPermisos();
    setreqSavePermisos({
      url:'/roles_permisos',
      method:'post',
      body: result
    })

  }

  useEffect(()=> {
    let objeto = {};
    if(!permisosByRol.loading && permisosByRol.data) {
        permisosByRol.data.data.forEach(el =>{
            el.acciones.forEach(accion => {
                objeto = {...objeto,[`${el.permiso.name}-${accion.name}`]:`${el.permiso._id}-${accion._id}`}
            })
        })
        setPemisosToStore(objeto)
    }
  },[permisosByRol.loading, permisosByRol.error]) 

  useEffect(()=> {
    if(!reqSavePermisos.loading && reqSavePermisos.data?.added) {
        dispatch(setMessage(reqSavePermisos.data.message))
        setTimeout(() => {
            dispatch(removeSuccessMessage())
        }, 4000);
    }
  },[reqSavePermisos.loading, reqSavePermisos.error]) 

  const handleChange = ({target}) => {
      const permiso = JSON.parse(target.name)[0];
      const action = JSON.parse(target.name)[1]
      if(target.checked) {

              setPemisosToStore({
                  ...permisosToStore,
                  [`${permiso.name}-${action.name}`]: `${permiso._id}-${action._id}`
              })
    
      }else {
          const objeto = {...permisosToStore};
          delete objeto[`${permiso.name}-${action.name}`]
          setPemisosToStore(objeto);
      }
  }

  const handleAccordionChange = (e) => {
      setTimeout(() => {
        const permConverterd = convertPermisos();
        // console.log(permConverterd);
     const permisoSelected = permConverterd.permisos.filter(element => element.permiso == e)
     console.log(permisoSelected);
     if(permisoSelected.length > 0) {
       permisoSelected[0].acciones.forEach(accion => {
        const checkBox = document.getElementById(`${e}-${accion}`)
        checkBox.checked = true
      })
     }
     
    }, 100);
  }


  return (
    <div className='assign-container'>
      <div className="resume">
        <div className="form-group">
            <div className="assign-field">
                <label>Nombre Rol</label>
                <input type="text" disabled value={data.name} />
            </div>
            <div className="assign-field">
                <label>Descripcion</label>
                <textarea cols={1} rows={6} disabled value={data.description} />
            </div>
        </div>
          <div className="header-assign-permisos">
             <p className='assign-permisos'>Permisos</p>
             {
                 Object.keys(permisosToStore).length > 0 &&  (
                    <Button  
                    onclick={handleClick}
                    icon={IconEdit}
                    color="var(--white)" 
                    background="var(--primary)"
                 >Guardar</Button>
                 )
             }
          </div>
      </div>
      {
          reqPermisos.loading ? (
            <Spinner />
          ): (
            <div className="permisos-collapse-container">
                <Collapse onChange={handleAccordionChange} accordion>

            {
              permisos.length > 0 ? (
                permisos.map(el => (
                    <Panel  className='pan-tab' key={el._id} header={el.name}>
                        <Form 
                            id='efe'
                            className={el.acciones.length > 0 ? 'form-tab':'form-if'}
                              form={form}
                            >
                        {
                            el.acciones.length > 0 ? (
                                el.acciones.map((accion,i) => (
                                  
                                      <div key={`${el._id}${i}`} className="form-group">
                                          <label>{accion.name}</label>
                                              <input type='checkbox' id={`${el._id}-${accion._id}`} name={`[${JSON.stringify(el)},${JSON.stringify(accion)}]`} style={{marginBottom:'1.5rem', marginTop:'.5rem'}}  onChange={handleChange} />
                                      </div>
                                      
                                ))
                            ): <h4 style={{fontFamily:'Lato'}}>No hay acciones registradas para este permiso</h4>
                        }
                        </Form>  
                     </Panel>
                ))
              ) : <h2 style={{fontFamily:'Inter'}}>No hay permisos registrados para asignar.</h2>
            }
              </Collapse>
            
        </div>
          )
        }
    </div>
  )
}
