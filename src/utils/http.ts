import axios, { type AxiosInstance } from 'axios'
import { config } from '@/constants/config'
import { toast } from 'react-toastify'
export const LocalStorageEventTarget = new EventTarget()
class Http {
    instance: AxiosInstance
    private token: string | null
    constructor() {
        this.token = localStorage.getItem('accessToken')
        this.instance = axios.create({
            baseURL: config.BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken')
                if (token) config.headers['Authorization'] = `Bearer ${token}`
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        this.instance.interceptors.response.use(
            (response) => {
                if (response.config.url === 'auth/login') {
                    this.token = response?.data.data.access_token
                    window.localStorage.setItem('accessToken', this.token as string)
                } else if (response.config.url === 'auth/logout') {
                    this.token = ''
                    window.localStorage.removeItem('accessToken')

                    LocalStorageEventTarget.dispatchEvent(new Event('logout'))
                }
                return response;
            },
            (error) => {
                const message = error.response?.data?.message || error.message
                toast.error(message)
                return Promise.reject(error)
            }
        )
    }
}
export const http = new Http().instance;