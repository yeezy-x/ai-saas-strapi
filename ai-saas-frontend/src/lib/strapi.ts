import { StringDecoder } from "node:string_decoder";

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
    return strapiFetch<strapiAuthResponse>('/api/auth/local',{
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

type One<T>={
    data:T
}

type Many<T>={
    data:T[]
}

async function strapiCreate<T>(jwt:string,
    path:string,
    fields:Record<string,unknown>,
){
    const res=await strapiFetch<One<T>>(
        path,
        {
            method:"POST",
            body:JSON.stringify({data:fields})
        },
        jwt
    )
    return res.data;
}

async function strapiList<T>(
  jwt: string,
  path: string,
  pageSize: string,
): Promise<T[]> {
  const q = new URLSearchParams({
    sort: "createdAt:desc",
    "pagination[pageSize]": pageSize,
  });

  const res = await strapiFetch<Many<T>>(`${path}?${q}`,{},jwt);
  return res.data;
}

export type ChatRole="user"|"assistant"  

export type StrapiMessage = {
  id: number;
  documentId: string;
  content: string;
  role: ChatRole;
  createdAt: string;
  updatedAt: string;
};

export type StrapiConversation = {
  id: number;
  documentId: string;
  title: string | null;
  messages?: StrapiMessage[];
  createdAt: string;
  updatedAt: string;
};

export async function createConversation(jwt:string, params:{title:string}):Promise<StrapiConversation>{
    return strapiCreate(jwt,'/api/conversations',{title:params.title})
}

export async function getConversation(jwt:string,documentId:string){
    try{
        const res=await strapiFetch<One<StrapiConversation>>(
            `/api/conversations/${encodeURIComponent(documentId)}`,
            {},
            jwt
        );
        return res.data;
    }catch(error){
        throw error;
    }
} 


export async function createMessage(
    jwt:string,
    params:{content:string, role:ChatRole, conversationDocumentId:string}
):Promise<StrapiMessage>{
    return strapiCreate(jwt,'/api/messages',{
        content:params.content,
        role:params.role,
        conversation: params.conversationDocumentId
    })
}

export type StrapiImageRecord = {
  id: number;
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export function createImageRecord(
  jwt: string,
  params: {
    prompt: string;
    imageUrl: string;
  }
): Promise<StrapiImageRecord> {
  return strapiCreate(
    jwt,
    "/api/images",
    {
      prompt: params.prompt,
      imageUrl: params.imageUrl,
    }
  );
}

export function listImageRecords(
  jwt: string
): Promise<StrapiImageRecord[]> {
  return strapiList(
    jwt,
    "/api/images",
    "24"
  );
}