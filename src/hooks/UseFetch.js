import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../config/axios.js'

const initialState = {
    loading: false,
    data:null,
    error:false
}





 

export const UseFetch = () => {
    const {token, refreshToken} = useSelector(state => state.authReducer);
    const [state, setstate] = useState(initialState);
    let axiosConfig = {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}IAM${refreshToken}` 
          }
      }

    useEffect(() => {
      setstate(initialState)
      return () => {
        setstate({})
      }
    }, [])
     const request = async (options, config = axiosConfig) => {
        const {method, url, body} = options;
        if(url) {
            try {
                setstate({
                    ...state,
                    loading:true
                })
                const axiosResponse = await axios[method](url, method !== 'get' && method !== 'delete' ? body : config,method != 'get' && method !== 'delete' && config);
                    setstate({
                        error:false,
                        data: axiosResponse.data,
                        loading:false
                    })
            } catch (error) {
                setstate({
                    data: null,
                    error:error.toString(),
                    loading: false
                })
            }
        }
    }
    return [state,request];
}

