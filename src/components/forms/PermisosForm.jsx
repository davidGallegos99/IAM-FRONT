import React, { useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd';
import '../../styles/formularios.css'

const { Option } = Select;

export const PermisosForm = ({
    onFinish,
    loading,
    acciones,
    dataEdit
}) => {
    const [form] =  Form.useForm();

    useEffect(()=> {
        if(dataEdit) {
            const acciones = dataEdit.acciones.map(accion => accion._id);
            console.log(acciones);
            form.setFieldsValue({
                name:dataEdit.name,
                path:dataEdit.path,
                acciones
            })
        }
    }, [])
  return (
    <div className='contenedor-formulario'>
        <Form
            onFinish={onFinish}
            form={form}
        >
            <label >Nombre</label>
            <Form.Item
                className='campo-permiso'
                name="name"
                rules={[
                    {required:true, message:'El nombre es requerido'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input placeholder='Nombre de la ruta' minLength={5} maxLength={25}/>
            </Form.Item>

            <label >Ruta</label>
            <Form.Item
            className='campo-permiso'
                name="path"
                rules={[
                    {required:true, message:'La ruta es requerida'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input disabled={dataEdit} placeholder='Ruta ejem: /permisos' minLength={5} maxLength={25}/>
            </Form.Item>

            <Form.Item
            className='campo-permiso'
                name="acciones"
            >
                <Select 
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                >
                    {
                        acciones.length > 0 && (
                            acciones.map(el => (
                                <Option key={el._id}>{el.name}</Option>
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
