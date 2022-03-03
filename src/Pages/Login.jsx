import React, {useEffect, useState } from 'react'
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
    const [isChangePass, setIschangePass] = useState(false);
    const [checkEmail, setcheckEmail] = UseFetch();
    const [checkUser, setcheckUser] = UseFetch();
    const [validEmail, setvalidEmail] = useState(false);
    const [reqRegister, setReqRegister] = UseFetch();
    const [type, settype] = useState('')
    const dispatch  = useDispatch();
    const [currentPass, setcurrentPass] = useState('')


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
            settype('error')
            setmensaje('Complete los campos correctamente');
            setTimeout(() => {
                setmensaje('')
                settype('')
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

    const handleChangePass = (e) => {
        e.preventDefault();

        if(form.password.trim() == ''  || form.password2.trim() == '') {
            setmensaje('Complete todos los campos')
            settype('error')
            setTimeout(() => {
                setmensaje('')
                settype('')
            }, 3000);
            return
        }
        
    
        if ((form.password !== form.password2)) {
            settype('error')
            setmensaje('Las contrasenas no coinciden.')
            setTimeout(() => {
                settype('')
                setmensaje('')
            }, 3000);
            return
        }
        setmensaje('')
        const dataToSend = {
            usuario:loginReq.data.data._id,
            password:form.password,
            password2:form.password2,
            current: currentPass
        }
        console.log(dataToSend);
        setReqRegister({
            url: '/usuario/changePass',
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
        if(!loginReq.error && loginReq.data && !loginReq.data?.data?.rol?.admin) {
            settype('error')
            setmensaje('Este usuario no tiene acceso a esta plataforma');
            return
        }
        // Va a cambiar la contrasena asignada al crear la cuenta
        if(!loginReq.error && loginReq.data && !loginReq.data?.data?.changePassword){
            setcurrentPass(form.password)
            setIschangePass(true)
            return
        }

        if(!loginReq.error && loginReq.data && loginReq.data?.data?.changePassword && loginReq.data?.data?.rol?.admin )  {
            setmensaje('');
            settype('')
            navigate('/home');
            dispatch(loginAction(loginReq.data.data));
            setTimeout(() => {
                location.reload();
            }, 300);
            return

        } else if(loginReq.error){
            settype('error')
            setmensaje('Credenciales incorrectas');
            return
        }
    },[loginReq.loading, loginReq.error]);


    



    useEffect( () => {
        if(!reqRegister.error && reqRegister.data)  {
            document.getElementById('loginForm').reset();
            settype('success')
            setmensaje('Se cambio la contraseña con exito');
            setTimeout(() => {
                location.reload();
            }, 4000);
        } else if(reqRegister.error){
            settype('error')
            setmensaje('Ha ocurrido un error, intentelo de nuevo mas tarde.');
        }
    },[reqRegister.loading, reqRegister.error]);

    useEffect(()=>{
            setmensaje('');
            document.getElementById('loginForm').reset();
    },[isChangePass])

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
                            type={type}
                            key="toast"
                        >{mensaje}</Toast>
                    </div>
                )
            }
            <form id="loginForm" autoComplete="off" onSubmit={!isChangePass ? handleLogin : handleChangePass} className=" form mt-4">
               {
                   !isChangePass && (
                    <div className="mb-4">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group">
                            <input id="email" type="email" onChange={(e)=>{handleInputChange(e)}}  name="email" className={`login-input login-user`} placeholder="email" />
                        </div>
                    </div>
                </div>
                   )
               }
                
                <div className="row mb-4">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group">
                            <input type="password" onChange={handleInputChange} name="password" className="login-input login-password" placeholder="password" />
                        </div>
                    </div>
                </div>
                {
                    isChangePass && (
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
                        <input type="submit" value={!loginReq.loading && !reqRegister.loading && !isChangePass ? 'LOGIN' : !loginReq.loading && !reqRegister.loading && isChangePass ? 'CAMBIAR CONTRASEÑA' : loginReq.loading || reqRegister.loading ? 'ESPERE...' : null} className={`login-submit ${loginReq.loading || reqRegister.loading && 'submit-loading'}`} disabled={loginReq.loading || reqRegister.loading} />
                    </div>
                </div>
            </form>
        </div>
    )
}
