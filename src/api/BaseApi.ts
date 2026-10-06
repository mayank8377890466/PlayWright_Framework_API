import { APIRequestContext,APIResponse } from "@playwright/test";
import {createLogger,Logger} from '../utils/logger';

 type ResponseOptions=
    {
        data?:object,
        headers?:Record<string,string>,
        params?:Record<string,string>,
    }
export class BaseApi
{
    protected request!: APIRequestContext;
    protected  log!:Logger;

    constructor(request:APIRequestContext)
    {
        this.request=request;
        this.log=createLogger(this.constructor.name);
    }

    async send(url:string,method:string,options:ResponseOptions = {}):Promise<APIResponse>
    {
            const startTime=Date.now();
            const response= await this.request.fetch(url,{method,...options});
            const duration =Date.now()-startTime;
            this.log.info(`${method} ${url} -> ${response.status()} (${duration}ms)`);
            return response;
    }
   
}