import { User } from '@entity/user';
import { ActualRole, Role, UserStatus } from '@entity/user/enum';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const mockedUser: User = {
    _id: new Types.ObjectId().toString(),
    id: new Types.ObjectId().toString(),
    fullName: 'fullName',
    password: 'password',
    roles: [Role.User],
    actualRole: ActualRole.Customer,
    status: UserStatus.Active,
  };

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: ['.env'] })],
      providers: [AuthService],
    })
      .useMocker(() => createMock())
      .compile();

    authService = authModule.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('extractJWTDataFromUser() function', () => {
    test('should return an JWT payload object', () => {
      const jwtData = authService.extractJWTDataFromUser(mockedUser);

      expect(jwtData).toBeInstanceOf(Object);
      expect(jwtData).toHaveProperty('userId');
      expect(jwtData).toHaveProperty('roles');
      expect(jwtData).toHaveProperty('actualRole');

      expect(jwtData).not.toBeNull();
      expect(jwtData).not.toBeUndefined();
    });
  });

  // Cannot get ENVs
  // describe('generateAccessToken() function', () => {
  //   test('should return an access token object', async () => {
  //     const payload = authService.extractJWTDataFromUser(mockedUser);
  //     const accessToken = await authService.generateAccessToken(payload);

  //     expect(accessToken).toBeInstanceOf(Object);
  //     expect(accessToken).toHaveProperty('token');
  //     expect(accessToken).toHaveProperty('expiresAt');
  //   });
  // });

  // describe('generateRefreshToken() function', () => {
  //   test('should return an refresh token object', async () => {
  //     const payload = authService.extractJWTDataFromUser(mockedUser);
  //     const accessToken = await authService.generateAccessToken(payload);

  //     expect(accessToken).toBeInstanceOf(Object);
  //     expect(accessToken).toHaveProperty('token');
  //     expect(accessToken).toHaveProperty('expiresAt');
  //   });
  // });

  // describe('createAuthData() function', () => {
  //   test('should return an JWT data object', async () => {
  //     const authData: AuthData = await authService.createAuthData(mockedUser);
  //     expect(authData).toBeInstanceOf(Object);
  //   });
  // });
});
