import {test,expect} from '../fixtures/apiFixtures';
import { buildBooking } from '../utils/bookingFactory';
import { BookingSchema } from '../schema/booking.schema';
import { createLogger } from '../utils/logger';

test.describe("CRUD Booking Tests",()=>
{
    test("TC01 get created booking",async ({bookingApi,createdBooking})=>
    {
       const log = createLogger('TC01');
       log.info(`Fetching booking with id=${createdBooking.id}`);
       const response=await bookingApi.get(createdBooking.id);
       log.info(`Response status: ${response.status()}`);
       expect(response.status()).toBe(200);
       const body = BookingSchema.safeParse(await response.json());
       expect(body.success).toBe(true);
       if (body.success) {
         expect(body.data.firstname).toBe(createdBooking.data.firstname);
         log.info(`Booking firstname verified: ${body.data.firstname}`);
       }
    })

    test("TC02 update booking",async({bookingApi,createdBooking,authToken})=>
    {
      const log = createLogger('TC02');
      const updatePayload = buildBooking({firstname:"Updated"});
      log.info(`Updating booking id=${createdBooking.id}`);
      const response=  await bookingApi.update(createdBooking.id,
        updatePayload,authToken);
      log.info(`Update response status: ${response.status()}`);
      expect(response.status()).toBe(200);
        const body= await response.json();
       expect(body.firstname).toBe('Updated');
       log.info(`Booking updated, firstname=${body.firstname}`);
    })

    test("TC03 update booking without token",async({bookingApi,createdBooking,authToken})=>
    {
      const log = createLogger('TC03');
      log.warn(`Attempting update with invalid token for booking id=${createdBooking.id}`);
      const response=  await bookingApi.update(createdBooking.id,
        buildBooking({firstname:"Updated"}),'Invalid');
      log.info(`Response status (expected 403): ${response.status()}`);
      expect(response.status()).toBe(403);
    })

     test("TC04 verify deleted booking",async({bookingApi,createdBooking,authToken})=>
    {
      const log = createLogger('TC04');
      log.info(`Deleting booking id=${createdBooking.id}`);
      const response=  await bookingApi.delete(createdBooking.id,authToken);
      log.info(`Delete response status: ${response.status()}`);
      expect(response.status()).toBe(201);
      const verify = await bookingApi.get(createdBooking.id);
      log.info(`Verify GET status (expected 404): ${verify.status()}`);
      expect(verify.status()).toBe(404);
    })

    });