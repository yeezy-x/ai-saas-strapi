const DEFAULT_STRAPI_URL = 'http://localhost:1337';

export const COOKIE_NAME ='strapi_jwt'

export type StrapiUser={
    id:number;
    username:string;
    email:string;
}

export type strapiAuthResponse={
    jwt:string;
    user:StrapiUser;
}
export class StrapiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name='StrapiError';
        this.status = status;
    }
}

async function strapiFetch<T>(
    path:string,
    init:RequestInit={},
    jwt?:string,
){
    const headers=new Headers(init.headers);
    if(!headers.has('Content-Type') && init.body){
        headers.set('Content-Type', 'application/json');
    }
    if(jwt){
        headers.set('Authorization', `Bearer ${jwt}`);
    }
    init.headers = headers;
    const response = await fetch(`${DEFAULT_STRAPI_URL}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
    });
    const data=await response.json().catch(()=>null)
    if(!response.ok){
        throw new StrapiError(response.status, response.statusText);
    }
    return data as Promise<T>;
}

export function registerWithStrapi(username:string, email:string, password:string){
    return strapiFetch<strapiAuthResponse>('/api/auth/local/register',{
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    })
}

export function loginWithStrapi(identifier:string, password:string){
    return strapiFetch<strapiAuthResponse>('/api/auth/local/login',{
        method: 'POST',
        body: JSON.stringify({
            identifier,
            password,
        }), 
    })
}

export function fetchCurrentUser(jwt:string){
    return strapiFetch<StrapiUser>('/api/users/me', {
        method: 'GET',
    }, jwt) 
}
