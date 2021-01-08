import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { getConnection } from 'typeorm'

const GRAPHQL_ENDPOINT = '/graphql'

const testUser = {
  userId: 'tester@tester.com',
  name: '테스터',
  password: '12345',
  phone: '01011112222',
}

describe('UserModule (e2e)', () => {
  let app: INestApplication
  let jwtToken: string

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT)
  const publicTest = (query: string) => baseTest().send({ query })
  const privateTest = (query: string) =>
    baseTest()
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ query })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    // test user 삭제
    await getConnection().query(
      `DELETE FROM g5_member WHERE mb_id = '${testUser.userId}'`,
    )
    app.close()
  })

  describe('createAccount', () => {
    it('should create account', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              userId: "${testUser.userId}",
              name: "${testUser.name}",
              password: "${testUser.password}",
              phone: "${testUser.phone}"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(true)
          expect(res.body.data.createAccount.error).toBe(null)
        })
    })

    it('should fail if account already exists', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              userId: "${testUser.userId}",
              name: "${testUser.name}",
              password: "${testUser.password}",
              phone: "${testUser.phone}"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                createAccount: { ok, error },
              },
            },
          } = res
          expect(ok).toBe(false)
          expect(error).toBe('There is a user with that userId already')
        })
    })
  })

  describe('login', () => {
    it('should login with correct credentials', () => {
      return publicTest(`
          mutation {
            login(input: {
              userId: "${testUser.userId}",
              password: "${testUser.password}"
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { login },
            },
          } = res
          expect(login.ok).toBe(true)
          expect(login.error).toBe(null)
          expect(login.token).toEqual(expect.any(String))
          jwtToken = login.token
        })
    })

    it('should not be able to login with wrong credentials', () => {
      return publicTest(`
          mutation {
            login(input: {
              userId: "${testUser.userId}",
              password: "wrongPassword"
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { login },
            },
          } = res
          expect(login.ok).toBe(false)
          expect(login.error).toBe('Wrong password')
          expect(login.token).toEqual(null)
        })
    })
  })

  describe('me', () => {
    it('should find my profile', () => {
      return privateTest(`
          {
            me {
              userId
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                me: { userId },
              },
            },
          } = res
          expect(userId).toBe(testUser.userId)
        })
    })

    it('should not allow logged out user', () => {
      return publicTest(`
          {
            me {
              userId
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: { errors },
          } = res
          const [error] = errors
          expect(error.message).toBe('Forbidden resource')
        })
    })
  })
})
