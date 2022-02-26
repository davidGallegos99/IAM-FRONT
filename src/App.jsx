import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PrivateRoutes } from './components/PrivateRoutes'
import { UseFetch } from './hooks/UseFetch'
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Usuarios } from './Pages/Usuarios'
import { logoutAction } from './redux/actions/auth'
import { Navbar } from './shared/Navbar'
import { SideBar } from './shared/SideBar'
import './styles/message.css'
import './App.css'
import { Permisos } from './Pages/Permisos'
import { Acciones } from './Pages/Acciones'
import { Roles } from './Pages/Roles'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const authRedux = useSelector(state => state.authReducer)
  const navigate = useNavigate();
  const [verifyToken, fetchVerify] = UseFetch();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isChecking, setisChecking] = useState(true)
  
  useEffect(()=> {
    if(pathname != '/login') {
      fetchVerify({
        url:'/auth/verifyToken',
        method: 'post',
        body:{}
      });
    }
  },[])

  useEffect( () => {
        if( verifyToken?.data &&  verifyToken?.data?.statusCode == 401) {
          setisLoggedIn(false);
          dispatch(logoutAction());
          navigate('/login');
        }
        if(verifyToken?.data?.statusCode == 200) {
          setisLoggedIn(true);
        }
        setisChecking(false);
  },[verifyToken.data,setisLoggedIn, dispatch]);
  
  return (
    <div className="App">
      {
        pathname != "/login" && isLoggedIn && (
            <SideBar />
        )
      }
        <div className="content">
          {
            pathname != "/login" && isLoggedIn && (
                <Navbar />
            )
          }
          <Routes>
              <Route path='/login' element={<Login />}></Route>
              
              <Route path='/home' element={<PrivateRoutes
                 isAuthenticated={isLoggedIn}
                 isChecking={isChecking}
                 component={()=><Home/>} 
              />}></Route>

              <Route path='/acciones' element={<PrivateRoutes
                 isAuthenticated={isLoggedIn}
                 isChecking={isChecking}
                 component={()=><Acciones/>} 
              />}></Route>


              <Route path='/roles' element={<PrivateRoutes
                 isAuthenticated={isLoggedIn}
                 isChecking={isChecking}
                 component={()=><Roles/>} 
              />}></Route>

              <Route path='/usuarios' element={<PrivateRoutes
                 isAuthenticated={isLoggedIn}
                 isChecking={isChecking}
                 component={()=><Usuarios/>} 
              />}></Route>

              <Route path='/permisos' element={<PrivateRoutes
                 isAuthenticated={isLoggedIn}
                 isChecking={isChecking}
                 component={()=><Permisos/>} 
              />}></Route>
              
          </Routes>
        </div>
    </div>
  )
}

export default App
