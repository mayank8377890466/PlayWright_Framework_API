import {APIResponse} from '@playwright/test';
import { BaseApi } from './BaseApi';

export class AuthApi extends BaseApi
{
     async getToken(username:string,password:string):Promise<APIResponse>
        {
            return this.send("/auth",'POST',{data:{username,password}});
        }
}