export type Account = {
  email: string
  password: string
}

export const ENV = {
  BASE_URL: 'https://oofe.azpassio.com',

  ACCOUNTS: {
    ADMIN: {
      email: 'admin@oole.com',
      password: '^iE3&x%VwhJU5^a@',
    } as Account,
  },
}