import { APIRequestContext,expect} from "@playwright/test";

export class ApiHelper
{
    constructor(private request:APIRequestContext){}

    async post(url:string,payload:object,headers?:Record<string,string>)
    {
       const response= await this.request.post(url,{data :payload,headers})
       expect( response.status() === 200 || response.status() === 201).toBe(true);
       return response.json();
    }

    async getToken(username:string,password:string)
    {
        const body = await this.post("/auth", { username, password });
        expect(body.token).toBeTruthy();
        return body.token;  
    }

    async get(url:string,param:any)
    {
        const response= await this.request.get(`${url}/${param}`);
        expect(response.status()).toBe(200);
        return response.json();
    }
    async put(url:string,param:any,payload:object,headers?:Record<string,string>)
    {
        const response=await this.request.put(`${url}/${param}`, { data: payload, headers });
        expect(response.status() === 200 || response.status() === 201).toBe(true);
        return response.json();
    }
     async delete(url:string,param:any,headers?:Record<string,string>)
    {
        const response=await this.request.delete(`${url}/${param}`, { headers });
        expect(response.status() === 200 || response.status() === 201).toBe(true);
        console.log(response);
    }

}