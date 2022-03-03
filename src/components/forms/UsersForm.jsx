import React, { useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd';
import '../../styles/formularios.css'
import { useSelector } from 'react-redux';
const { VITE_SUPERADMIN_ROL: SUPERADMIN_ROL } = import.meta.env

const { Option } = Select;

export const UsersForm = ({
    onFinish,
    loading,
    dataEdit,
    roles,
}) => {
    const [form] =  Form.useForm();
    const {rol:userRol} = useSelector(state=>state.authReducer) 
    const PrintRole = (rol) => {
        if(rol._id !== SUPERADMIN_ROL && userRol._id) {
            return (
                <Option key={rol._id}>{rol.name}</Option>
            )
        }
        if(rol._id == SUPERADMIN_ROL && SUPERADMIN_ROL == userRol._id) {
            return (
                <Option key={rol._id}>{rol.name}</Option>
            )
        }
    }

    useEffect(()=> {
        if(dataEdit) {
            const acciones = dataEdit.acciones.map(accion => accion._id);
            console.log(acciones);
            // form.setFieldsValue({
            //     name:dataEdit.name,
            //     path:dataEdit.path,
            //     acciones
            // })
        }
    }, [])
  return (
    <div className='contenedor-formulario'>
        <Form
            onFinish={onFinish}
            form={form}
        >
            <label >Email</label>
            <Form.Item
                className='campo-permiso'
                name="email"
                rules={[
                    {required:true, message:'El email es requerido'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input type="email" placeholder='Correo electronico' minLength={5} maxLength={200}/>
            </Form.Item>

            <label >Primer nombre</label>
            <Form.Item
            className='campo-permiso'
                name="first_name"
                rules={[
                    {required:true, message:'El nombre es requerido'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input  placeholder='Nombre' minLength={5} maxLength={25}/>
            </Form.Item>
            <label >Apellido</label>

            <Form.Item
                className='campo-permiso'
                name="last_name"
                rules={[
                    {required:true, message:'El apellido es requerido'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input  placeholder='Apellido' minLength={5} maxLength={25}/>
                
            </Form.Item>
            <label >Rol</label>

            <Form.Item
            className='campo-permiso'
                name="rol"
            >
                <Select 
                        style={{ width: '100%' }}
                        placeholder="Selecciona un rol"
                    >
                        {
                            roles.length > 0 && (
                                roles.map(el => (
                                    PrintRole(el)
                                ))
                            )
                        }
                </Select>                
            </Form.Item>

            <Form.Item>
                <Button
                    className='button'
                    type='primary'
                    htmlType='submit'
                    loading={loading}
                >
                    Guardar cambios
                </Button>
            </Form.Item>
        </Form>
    </div>
  )
}
