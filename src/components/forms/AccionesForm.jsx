import React from 'react'
import { Form, Input, Button } from 'antd';
import '../../styles/formularios.css'

export const AccionesForm = ({
    onFinish,
    loading
}) => {
    const [form] =  Form.useForm();
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
                <Input placeholder='Nombre de la accion' minLength={5} maxLength={50}/>
            </Form.Item>

            <label >Ruta</label>
            <Form.Item
            className='campo-permiso'
                name="description"
                rules={[
                    {required:true, message:'La descripcion es requerida'},
                    {min:5, message:'Debe tener al menos 5 caracteres'}
                ]}
            >
                <Input placeholder='ejem: Permite crear registro' minLength={5} maxLength={150}/>
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
