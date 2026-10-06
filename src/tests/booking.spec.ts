import {test,expect} from '../fixtures/apiFixtures';
import bookingPayload from '../test-data/booking.json';
import { createLogger } from '../utils/logger';

test.describe.serial("Booking tests",()=>
{
    let bookingId: number;

    test("TC01 create single booking",async({api})=>
    {
       const log = createLogger('TC01');
       log.info('Creating new booking');
       const body= await api.post("/booking",bookingPayload.newBooking);
       bookingId =body.bookingid;
       log.info(`Booking created with id=${bookingId}`);
       expect(body.bookingid).toBeTruthy();
       expect(body.booking.firstname).toBe(bookingPayload.newBooking.firstname);
    });

    test("TC02 get single booking",async({api})=>
    {
       const log = createLogger('TC02');
       log.info('Creating booking to read');
       const bodyCreate= await api.post("/booking",bookingPayload.newBooking);
       bookingId =bodyCreate.bookingid;
       log.info(`Fetching booking id=${bookingId}`);
       const body= await api.get('/booking',bookingId);
       log.info(`Retrieved booking firstname=${body.firstname}`);
       expect(body.firstname).toBe(bookingPayload.newBooking.firstname);
    });

    test("TC03 update single booking",async({api,authToken})=>
    {
       const log = createLogger('TC03');
       log.info('Creating booking to update');
       const bodyCreate= await api.post("/booking",bookingPayload.newBooking);
       bookingId =bodyCreate.bookingid;
       log.info(`Updating booking id=${bookingId}`);
       const bodyUpdate= await api.put('/booking', bookingId,
         { ...bookingPayload.newBooking, firstname: "Updated" },
         { Cookie: `token=${authToken}` }
       );
       log.info(`Booking updated, firstname=${bodyUpdate.firstname}`);
       expect(bodyUpdate.firstname).toBe("Updated");
    });

    test("TC04 delete single booking",async({api,authToken})=>
    {
       const log = createLogger('TC04');
       log.info('Creating booking to delete');
       const bodyCreate= await api.post("/booking",bookingPayload.newBooking);
       bookingId =bodyCreate.bookingid;
       log.info(`Deleting booking id=${bookingId}`);
       const bodyUpdate= await api.delete('/booking', bookingId,
         { Cookie: `token=${authToken}` }
       );
       log.info(`Delete response received`);
    });

})