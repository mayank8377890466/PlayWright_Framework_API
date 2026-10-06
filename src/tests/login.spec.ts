import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/ApiHelper';
import { createLogger } from '../utils/logger';

test.describe("Test for user authentication",()=>
{
    const log = createLogger('Login');

    test("TC01 Verify valid authentication",async ({request})=>
    {
    log.info('Requesting auth token via direct POST');
    const response= await request.post("/auth",{
            data:{
                username: process.env.API_USERNAME!,
                password: process.env.API_PASSWORD!
            }
        });
       log.info(`Auth response status: ${response.status()}`);
       expect(response.status()).toBe(200);
       const body=await response.json();
       expect(body.token).toBeTruthy();
       log.info(`Token received (length=${body.token?.length ?? 0})`);
    });

     test("TC02 Verify valid authentication via ApiHelper",async ({request})=>
    {
        const api =new ApiHelper(request);
        log.info('Requesting auth token via ApiHelper.getToken');
        const token= await api.getToken(process.env.API_USERNAME!, process.env.API_PASSWORD!);
        log.info(`Token received (length=${token?.length ?? 0})`);
        expect(token).toBeTruthy();
    });

})