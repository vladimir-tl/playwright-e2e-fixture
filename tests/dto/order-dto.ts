export class OrderDto {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number | undefined

  constructor(
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
  }

  // add a method to create a new instance with orderid = undefined
  static createOrderWithoutId(): OrderDto {
    return new OrderDto(
      'OPEN',
      Math.floor(Math.random() * 100),
      'John Doe',
      '+123456789',
      'Urgent order',
    )
  }
}