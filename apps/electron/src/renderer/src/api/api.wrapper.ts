import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

// Default config for the axios instance
const axiosParams = {
	// Set different base URL based on the environment
	baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5173' : '/',
	// Alternative if you have more environments
	// baseURL: process.env.VUE_APP_API_BASE_URL
}

export interface RequestBody {
	[key: string]: any
}

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams)

// Main api function
const api = (axios: AxiosInstance) => {
	// Wrapper functions around axios
	return {
		get: <TRes extends unknown>(url: string, config?: AxiosRequestConfig) => axios.get<TRes>(url, config),
		post: (url: string, body: RequestBody | FormData, config?: AxiosRequestConfig) => axios.post(url, body, config),
		patch: (url: string, body: RequestBody, config?: AxiosRequestConfig) => axios.patch(url, body, config),
		put: (url: string, body: RequestBody, config?: AxiosRequestConfig) => axios.put(url, body, config),
		delete: (url: string, config?: AxiosRequestConfig) => axios.delete(url, config),
		deleteLseElement: (url: string, body: RequestBody, config?: AxiosRequestConfig) =>
			axios({
				method: 'DELETE',
				url,
				data: body,
				...config,
			}),
		propfind: (url: string, data: string, config?: AxiosRequestConfig) =>
			axios({
				method: 'PROPFIND',
				url,
				data,
				...config,
			}),
	}
}

// Initialise the api function and pass axiosInstance to it
export default api(axiosInstance)
