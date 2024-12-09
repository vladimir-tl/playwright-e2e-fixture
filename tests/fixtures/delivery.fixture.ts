import { Page, test as base } from '@playwright/test'
import { BASE_API, loginPath, orderPath, SERVICE_URL } from '../../config/env-data'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

type Fixtures = {
  auth: { jwt: string }
  orderId: string
  mainPage: Page
}

export const test = base.extend<Fixtures>({
  auth: async ({ request }, use) => {
    // Authorization fixture: Fetch JWT and provide it
    console.log('Init: getting jwt')
    const response = await request.post(`${BASE_API}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const jwt = await response.text()

    await use({ jwt })
  },

  orderId: async ({ auth, request }, use) => {
    // Order ID fixture: Create an order and expose the orderId
    const response = await request.post(`${BASE_API}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    })

    const responseData = await response.json()
    const orderId = responseData.id
    console.log('order created with id: ', orderId)
    await use(orderId)
  },

  mainPage: async ({ context, auth }, use) => {
    // Set JWT in localStorage
    await context.addInitScript((token) => {
      localStorage.setItem('jwt', token)
    }, auth.jwt)

    const mainPage = await context.newPage()

    await mainPage.route(`${BASE_API}${orderPath}/*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'DELIVERED',
          courierId: null,
          customerName: 'mocked customer',
          customerPhone: '99887766',
          comment: '',
          id: 9999,
        }),
      }),
    )

    await mainPage.goto(SERVICE_URL)
    await use(mainPage)
  },
})

export { expect } from '@playwright/test'
