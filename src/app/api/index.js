import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import {login, logout, removeToken} from '../slices/userSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://medimind-backend-ten.vercel.app/',
    credentials: 'include',
    prepareHeaders: (Headers, { getState }) => {
        const token = getState().user.token;
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        Headers.set('Content-Type', 'application/json');
        return Headers;
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401 && (result.error.data?.detail === "Authentication credentials were not provided." || result.error.data?.code === "token_not_valid")) {
        console.log("Token expired, refreshing...");
        api.dispatch(removeToken());

        const refreshResult = await baseQuery({
            url: '/users/refresh-token/',
            method: 'POST'
        },
            api,
            extraOptions);
        
        if (refreshResult.data){
            console.log("Token refreshed");
            api.dispatch(login(refreshResult.data));
            result = await baseQuery(args, api, extraOptions);
        }
        else{
            console.error('Token Refresh Failed. Logging Out.');
            api.dispatch(logout());
        }

    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
    })
})
