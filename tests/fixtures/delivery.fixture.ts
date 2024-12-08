import { test as base } from '@playwright/test'
import { BASE_API, loginPath, orderPath } from '../../config/env-data'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

type Fixtures = {
  auth: { jwt: string }
  orderId: string
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
})

export { expect } from '@playwright/test'
