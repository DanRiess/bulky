import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

// Default config for the axios instance
const axiosParams = {
	// Set different base URL based on the environment
	baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5173' : '/',
	// Alternative if you have more environments
	// baseURL: process.env.VUE_APP_API_BASE_URL
}

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams)

// Main api function
const api = (axios: AxiosInstance) => {
	// Wrapper functions around axios
	return {
		get: <TRes extends unknown>(url: string, config?: AxiosRequestConfig) => axios.get<TRes>(url, config),
		post: <TRes extends unknown, TData extends Record<string, any>>(url: string, data: TData, config?: AxiosRequestConfig) =>
			axios.post<TRes>(url, data, config),
		patch: <TRes extends unknown, TData extends Record<string, any>>(url: string, data: TData, config?: AxiosRequestConfig) =>
			axios.patch<TRes>(url, data, config),
		put: <TRes extends unknown, TData extends Record<string, any>>(url: string, data: TData, config?: AxiosRequestConfig) =>
			axios.put<TRes>(url, data, config),
		delete: <TRes extends unknown>(url: string, config?: AxiosRequestConfig) => axios.delete<TRes>(url, config),
	}
}

// Initialise the api function and pass axiosInstance to it
export default api(axiosInstance)
