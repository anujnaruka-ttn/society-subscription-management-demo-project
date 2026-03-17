import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConnectorProps } from "@/types/ApiConnector";

const axiosInstance = axios.create({});

export const apiConnector = ({
    method,
    url,
    data,
    headers,
    params,
}: ApiConnectorProps): Promise<AxiosResponse> => {

    const config: AxiosRequestConfig = {
        method: method,
        url: url,
        data: data || null,
        headers: headers || null,
        params: params || null,
    };
    return axiosInstance(config);
};
