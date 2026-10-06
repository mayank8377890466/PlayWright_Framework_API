import { test as base, } from '@playwright/test';
import { BookingApi } from '../api/BookingApi';
import { AuthApi } from '../api/AuthApi';
import { buildBooking } from '../utils/bookingFactory';
import  {Booking} from '../models/booking';

type TestFixture = {
bookingApi: BookingApi;
  authToken: string;
  createdBooking: { id: number; data: Booking };
};

export const test = base.extend<TestFixture>({
    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    },
    authToken: async({request},use)=>
    {
        const response = await new AuthApi(request).getToken(process.env.API_USERNAME!, process.env.API_PASSWORD!);
        const body = await response.json();
        await use(body.token);
    },
    createdBooking:async({bookingApi,authToken},use)=>
    {
        const data=buildBooking();
        const created=  await bookingApi.create(data);
        await use({id: created.id, data});
        await bookingApi.delete(created.id,authToken);
    }

});

export { expect } from "@playwright/test";