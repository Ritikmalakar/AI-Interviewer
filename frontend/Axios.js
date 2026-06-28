import axios from 'axios'

export const baseUrlUser = axios.create({
  baseURL: `${import.meta.env.VITE_API_KEY}/user`,
  withCredentials: true
});


export const baseUrlInterview = axios.create({
  baseURL: `${import.meta.env.VITE_API_KEY}/interview`,
  withCredentials: true
});
