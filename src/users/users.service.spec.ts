import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from 'src/jwt/jwt.service'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
})

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
})

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('UsersService', () => {
  let service: UsersService
  let jwtService: JwtService
  let usersRepository: MockRepository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
    usersRepository = module.get(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createAccount', () => {
    const createAccountArgs = {
      userId: 'test@test.com',
      name: '테스터',
      password: '12345',
      phone: '01011112222',
    }

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        userId: 'test@test.com',
      })

      const result = await service.createAccount(createAccountArgs)

      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that userId already',
      })
    })

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined)
      usersRepository.create.mockReturnValue(createAccountArgs)
      usersRepository.save.mockResolvedValue(createAccountArgs)

      const result = await service.createAccount(createAccountArgs)
      expect(result).toEqual({ ok: true })
    })

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error())
      const result = await service.createAccount(createAccountArgs)
      expect(result).toEqual({ ok: false, error: "Couldn't create account" })
    })
  })

  describe('login', () => {
    const loginArgs = {
      userId: 'test@test.com',
      password: '12345',
    }

    it('should fail if user does not exist ', async () => {
      usersRepository.findOne.mockResolvedValue(null)

      const result = await service.login(loginArgs)

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      )

      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      })
    })

    it('should fail if the password is wrong ', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      }
      usersRepository.findOne.mockResolvedValue(mockedUser)

      const result = await service.login(loginArgs)
      expect(result).toEqual({ ok: false, error: 'Wrong password' })
    })

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      }

      usersRepository.findOne.mockResolvedValue(mockedUser)
      const result = await service.login(loginArgs)
      expect(jwtService.sign).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
      expect(result).toEqual({ ok: true, token: 'signed-token' })
    })

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error())
      const result = await service.login(loginArgs)
      expect(result).toEqual({ ok: false, error: "Can't log user in." })
    })
  })

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    }

    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs)
      const result = await service.findById(1)
      expect(result).toEqual({ ok: true, user: findByIdArgs })
    })

    it('should fail if on user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error())
      const result = await service.findById(1)
      expect(result).toEqual({ ok: false, error: 'User Not Found' })
    })
  })
})
