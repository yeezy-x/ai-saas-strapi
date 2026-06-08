const DEFAULT_STRAPI_URL = 'http://localhost:1337';

export class StrapiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name='StrapiError';
        this.status = status;
    }
}

async function strapiFetch<T>(path:string,
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

