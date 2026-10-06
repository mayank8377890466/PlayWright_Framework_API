import { faker } from '@faker-js/faker';
import { Booking } from '../models/booking';

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 100, max: 1000 }),
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}