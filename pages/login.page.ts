// Import Page và Locator từ Playwright
// Page: đại diện cho 1 tab browser
// Locator: đại diện cho 1 element trên trang
import { Page, Locator } from '@playwright/test'

// export để file khác có thể import class này
export class LoginPage {

  // readonly nghĩa là sau khi gán giá trị rồi thì không được thay đổi lại
  // page là tab trình duyệt
  readonly page: Page

  // Các locator đại diện cho element trên trang login
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signInButton: Locator

  // Constructor sẽ chạy khi ta tạo new LoginPage(page)
  constructor(page: Page) {

    // Lưu lại tab browser vào class
    this.page = page

    // Định nghĩa locator cho các element
    // getByRole là cách Playwright tìm element theo accessibility role
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.signInButton = page.getByRole('button', { name: 'Sign In' })
  }

  // Hàm dùng để mở trang login
  async goto() {
    // baseURL đã được config nên chỉ cần '/login'
    await this.page.goto('/login')
  }

  // Hàm login cơ bản
  // Nhận vào email và password kiểu string
  async login(email: string, password: string) {

    // Điền email vào ô email
    await this.emailInput.fill(email)

    // Điền password vào ô password
    await this.passwordInput.fill(password)

    // Click nút Sign In
    await this.signInButton.click()
  }

  // Hàm tiện lợi hơn: truyền cả object account vào
  // account phải có email và password
  async loginWithAccount(account: { email: string; password: string }) {

    // Gọi lại hàm login ở trên
    await this.login(account.email, account.password)
  }
}