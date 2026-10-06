import {APIResponse} from '@playwright/test';
import  {Booking} from '../models/booking';
import { BaseApi } from './BaseApi';

export class BookingApi extends BaseApi{

    async create(payload:Booking)
    {
        const response = await this.send("/booking",'POST',{data:payload});
        const body = await response.json();
        return { id: body.bookingid, ...body };
    }
    get(param:number):Promise<APIResponse>
    {
        return this.send(`/booking/${param}`,'GET',{});
    }
    update(param:number,payload:Booking,token:string):Promise<APIResponse>
    {
        return this.send(`/booking/${param}`,'PUT',{
            data:payload,
            headers:{Cookie:`token=${token}`}
        });
    }
    delete(param:number,token:string):Promise<APIResponse>
    {
        return this.send(`/booking/${param}`,'DELETE',{
            headers:{Cookie:`token=${token}`}
        });
    }

}