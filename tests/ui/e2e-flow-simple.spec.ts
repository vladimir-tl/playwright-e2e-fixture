import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/ar'
import { BASE_API, loginPath, orderPath, SERVICE_URL } from '../../config/env-data'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

let jwt: string = ''

test.beforeAll(async ({ request }) => {
  console.log('Init: getting jwt')
  const response = await request.post(`${BASE_API}${loginPath}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  jwt = await response.text()
})

test.beforeEach(async ({ context }) => {
  // Set the local storage value for 'jwt'
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, jwt)
})

test('create order', async ({ context }) => {
  const page = await context.newPage()
  await page.goto(SERVICE_URL)
  await page.getByTestId('username-input').fill(faker.internet.username())
  await page.getByTestId('phone-input').fill(faker.phone.number())
  await page.getByTestId('createOrder-button').click()
  await expect(page.getByTestId('orderSuccessfullyCreated-popup-ok-button')).toBeVisible()
})

test('search for order created through API', async ({ context, request }) => {
  const orderResponse = await request.post(`${BASE_API}${orderPath}`, {
    data: OrderDto.createOrderWithoutId(),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })

  const orderResponseBody = await orderResponse.json()

  const page = await context.newPage()
  await page.goto(SERVICE_URL)
  await page.getByTestId('openStatusPopup-button').click()
  await page.getByTestId('searchOrder-input').fill(String(orderResponseBody.id))
  await page.getByTestId('searchOrder-submitButton').click()
  await expect(page.getByText('OPEN')).toBeVisible()
})
