import axios, { AxiosInstance } from 'axios';
import config from '../config';
import TokenUtil from './TokenUtil';

const getAxiosInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: config.API_URL,
        headers: {
            Authorization: `Bearer ${TokenUtil.get()}`
        },
        withCredentials: true
    });
};

const Api = getAxiosInstance();

export default Api;
