import { test, expect } from '@playwright/test'
import { getSpecificData } from '../utils/googleSheet'

test.describe('Google Sheet Data Test', () => {

  test('Read specific cells from Sheet2', async () => {

    // Gọi function đọc sheet
    const data = await getSpecificData()

    // In ra console để xem
    console.log('A2:', data.A2)
    console.log('A5:', data.A5)
    console.log('D5:', data.D5)
    console.log('A8:', data.A8)
    console.log('B8:', data.B8)
    console.log('C8:', data.C8)
    console.log('D8:', data.D8)
    console.log('E8:', data.E8)
    console.log('F8:', data.F8)
    console.log('G8:', data.G8)
    console.log('H8:', data.H8)
    // console.log('Row 8 (A8-H8):', data.row8)

    console.log('Jobs:', data.jobs)

    // In từng job cho dễ debug
    data.jobs.forEach((job, index) => {
      console.log(`Job ${index + 1}:`, job)
    })

    // Ví dụ verify (tuỳ bạn chỉnh expected)
    expect(data.A2).toBeDefined()
    expect(data.A8).toBeDefined()
    expect(data.B8).toBeDefined()
    expect(data.C8).toBeDefined()
    expect(data.D8).toBeDefined()
    expect(data.E8).toBeDefined()
    expect(data.F8).toBeDefined()
    expect(data.G8).toBeDefined()
    expect(data.H8).toBeDefined()
    expect(data.jobs.length).toBeGreaterThan(0)
  })

})



