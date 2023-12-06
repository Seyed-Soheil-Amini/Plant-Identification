import axios from 'axios'
import { redirect } from 'react-router-dom'

// export const baseUrl = window.location.origin
export const baseUrl = 'http://localhost:9000'

axios.defaults.baseURL = baseUrl;

axios.interceptors.response.use(response => response,async error => {
    const status = error.response ? error.response.status : null
    if (status === 401) {
        try {
            const data = await refreshAxios.post('/refresh/token/')
            if(data?.status === 200) return axios.request(error.config);
        } catch (error) {
            console.log(error)
            localStorage.removeItem('username')
            localStorage.removeItem('lr')
            throw redirect('/login?message=There was some problem.You must log in again!')
        }
    }

    return Promise.reject(error);
});


export const loginAxios = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

axios.defaults.withCredentials = true

export const verifyAxios = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

verifyAxios.interceptors.response.use(
    response => response,
    async (error) => {
        if (error?.response?.status === 401) {
            try {
                const refresh = await axios.post('/refresh/token/', {}, {
                    withCredentials: true
                })
                return Promise.resolve(refresh)
            }
            catch (error) {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)


export const refreshAxios = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

refreshAxios.interceptors.response.use(
    (response) => {
        localStorage.setItem('lr', new Date())
        return response
    },
    (error) => {
        localStorage.removeItem('username')
        localStorage.removeItem('lr')
        return Promise.reject(error)
    }
)


export default async function requireAuth() {
    if(!localStorage.getItem('lr') || !localStorage.getItem('username')){
        throw redirect('/login?message=You must log in first!')
    }
    try {
        if (Date.parse(localStorage.getItem('lr')) < ((new Date()) - 60 * 60000)) {
            const data = await refreshAxios.post('/refresh/token/')
            if(data?.status === 200) return
        }
    } catch (error) {
        if (error?.response?.status === 401) throw redirect('/login?message=There was some problem.You must log in again!')
    }
}