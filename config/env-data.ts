import dotenv from 'dotenv'

if (process.env.CI !== 'true') {
  dotenv.config({ path: 'env/prod.env' })
  console.log('Running in local environment')
} else {
  console.log('Running in CI environment')
}

const requiredVars = ['URL', 'TEST_USERNAME', 'TEST_PASSWORD', 'BASE_API']

// Check for missing variables
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export const SERVICE_URL: string = process.env.URL!
export const USERNAME: string = process.env.TEST_USERNAME!
export const PASSWORD: string = process.env.TEST_PASSWORD!
export const BASE_API: string = process.env.BASE_API!

export const loginPath = '/login/student'
export const orderPath = '/orders'
