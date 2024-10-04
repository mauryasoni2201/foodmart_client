import {QueryClient} from "@tanstack/react-query";

export const client:QueryClient = new QueryClient();
export const backendUrl:string = "http://localhost:4000"";

interface RequestParams{
    url:string;
    configuration:RequestInit 
}

export const sendRequest=async({url,configuration}:RequestParams):Promise<any>=>{
    try{
        const response = await fetch(url,configuration);
        const data = await response.json();
        if(!response.ok){
            throw new Error(`${data.message}`);
        }else{
            return {statusCode:response.status,data};
        }
    }catch(error:any){
        throw new Error(`${error.message}`);
    }
}

export const getAllData=async(url:string,configuration?:RequestInit):Promise<any>=>{
    try{
        const response = await fetch(url,configuration);
        const data =  await response.json();
        if(!response.ok){
            throw new Error(`${data.message}`);
        }
        return data;
    }catch(error:any){
        throw new Error(`${error.message}`);
    }
}

