import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { UseFetch } from '../hooks/UseFetch';
import { UseForm } from '../hooks/UseForm';
import '../styles/Login.css'
import AccessIcon from '../images/access.png'
import { Toast } from '../components/Toast';
import { useDispatch } from 'react-redux';
import { loginAction } from '../redux/actions/auth';
export const Login = () => {
    
    const initialState = {
        email: '',
        password: ''
    }
    const [timeout, setTime] = useState(null);
    const [loginReq, sendLogin] = UseFetch();
    const [form, handleInputChange, resetForm] = UseForm(initialState);
    const [mensaje, setmensaje] = useState('');
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [checkEmail, setcheckEmail] = UseFetch();
    const [checkUser, setcheckUser] = UseFetch();
    const [validEmail, setvalidEmail] = useState(false);
    const [reqRegister, setReqRegister] = UseFetch();
    const dispatch  = useDispatch();


    useEffect(() => {
        const body = document.getElementsByTagName('body');
        body[0].style.background = '#264ECA';
        return () => {
            body[0].style.background = 'white';
        }
    },[])

    const handleLogin = (e) => {
        e.preventDefault();
        if(form.email.trim() == '' || form.password.trim() == '') {
            setmensaje('Complete los campos correctamente');
            setTimeout(() => {
                setmensaje('')
            }, 3000);
            return;
        }
        const opts = {
            url:`/auth/login`,
            method:'post',
            body: form
        }
        sendLogin(opts);
    }

    const handleRegister = (e) => {
        e.preventDefault();

        if(form.email.trim() == '' || form.password.trim() == ''  || form.password2.trim() == '') {
            setmensaje('Complete todos los campos')
            setTimeout(() => {
                setmensaje('')
            }, 3000);
            return
        }
        
        if(!checkEmail.data?.available) {
            setmensaje('Email ya esta en uso.')
            setTimeout(() => {
                setmensaje('')
            }, 3000);
            return
        }
        if ((form.password !== form.password2)) {
            setmensaje('Las contrasenas no coinciden.')
            setTimeout(() => {
                setmensaje('')
            }, 3000);
            return
        }
        setmensaje('')
        const dataToSend = {
            email:form.email,
            username: form.username,
            password:form.password
        }
        setReqRegister({
            url: '/usuario/create',
            method: 'post',
            body: dataToSend
        })
    } 

    const handleCheckEmail = ({target}) => {
        const match = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(target.value);
        if(match && form.email.length > 5) {
            setvalidEmail(true);
            clearTimeout(timeout)
            setTime( setTimeout(() => {
                console.log('Has dejado de escribir en el input')
                setcheckEmail({
                    url:`/auth/checkEmail/${target.value}`,
                    method:'get'
                })
                clearTimeout(timeout)
            },2000))
        }
    }
 

    useEffect( () => {
        if(!loginReq.error && loginReq.data)  {
            setmensaje('');
            navigate('/home');
            dispatch(loginAction(loginReq.data.data));
        } else if(loginReq.error){
            setmensaje('Credenciales incorrectas');
        }
    },[loginReq.loading, loginReq.error]);


    useEffect( () => {
        if(!checkEmail.error && checkEmail.data?.available)  {
            setmensaje('');
        } else if(!checkEmail.error || !checkEmail.data?.available){
            setmensaje('Email ya esta en uso');
        }
    },[checkEmail.loading, checkEmail.error]);



    useEffect( () => {
        if(!reqRegister.error && reqRegister.data)  {
            setmensaje('');
            navigate('/home');
            location.reload();
        } else if(reqRegister.error){
            setmensaje('Ha ocurrido un error, intentelo de nuevo mas tarde.');
        }
    },[reqRegister.loading, reqRegister.error]);

    useEffect(()=>{
            setmensaje('');
            document.getElementById('loginForm').reset();
    },[isRegister])

    return (
        <div className="login-container">
            <div className="row mb-5">
                <div className="col-md-12">
                    <img width={170} src={AccessIcon} style={{marginBottom:'2rem'}} alt="Login icon"/>
                </div>
            </div>
            {
                mensaje && (
                    <div className='login-message-container'>
                        <Toast 
                            type="error"
                            key="toast"
                        >{mensaje}</Toast>
                    </div>
                )
            }
            <form id="loginForm" autoComplete="off" onSubmit={!isRegister ? handleLogin : handleRegister} className=" form mt-4">
                <div className="mb-4">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group">
                            <input id="email" type="email" onChange={(e)=>{
                                handleInputChange(e);
                                if(isRegister) handleCheckEmail(e);
                            }}  name="email" className={`login-input login-user ${ validEmail && (checkEmail.data?.statusCode && isRegister && checkEmail.data?.ok) ? 'checked' : ((!validEmail && isRegister && form?.email?.length > 5) || (checkEmail.data?.statusCode && isRegister && !checkEmail.data?.ok )) && 'is-used'}`} placeholder="email" />
                        </div>
                    </div>
                </div>
                
                <div className="row mb-4">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group">
                            <input type="password" onChange={handleInputChange} name="password" className="login-input login-password" placeholder="password" />
                        </div>
                    </div>
                </div>
                {
                    isRegister && (
                        <div className="row mb-4">
                            <div className="col-md-12 d-flex justify-content-center">
                                <div className="form-group">
                                    <input type="password" onChange={handleInputChange} name="password2" className="login-input login-password" placeholder="Confirm password" />
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="row mt-5 d-flex flex-column align-items-center">
                    <div className="col-md-12 flex-end d-flex flex-column align-items-center">
                        <input type="submit" value={!loginReq.loading && !reqRegister.loading && !isRegister ? 'LOGIN' : !loginReq.loading && !reqRegister.loading && isRegister ? 'REGISTRARSE' : loginReq.loading || reqRegister.loading ? 'ESPERE...' : null} className={`login-submit ${loginReq.loading || reqRegister.loading && 'submit-loading'}`} disabled={loginReq.loading || reqRegister.loading} />
                        <p onClick={()=> setIsRegister(!isRegister)} className="text-white mt-3 register" >{!isRegister ? 'No tienes una cuenta?' : 'Iniciar sesion'}</p>
                    </div>
                </div>
            </form>
        </div>
    )
}
