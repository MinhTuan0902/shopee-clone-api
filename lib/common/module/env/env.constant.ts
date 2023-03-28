export enum NodeENV {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum ENVVariable {
  APIServerPort = 'API_SERVER_PORT',
  NodeENV = 'NODE_ENV',
  MongoURIDevelop = 'MONGO_URI_DEVELOP',
  MongoURIProduction = 'MONGO_URI_PRODUCTION',
  TwilioAccountSID = 'TWILIO_ACCOUNT_SID',
  TwilioAuthToken = 'TWILIO_AUTH_TOKEN',
  TwilioVirtualPhoneNumber = 'TWILIO_VIRTUAL_PHONE_NUMBER',
  RedisHost = 'REDIS_HOST',
  RedisPort = 'REDIS_PORT',
  OTPTimeToLive = 'OTP_TTL',
  JWTSecret = 'JWT_SECRET',
  JWTAccessTokenExpirationTime = 'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  JWTRefreshTokenExpirationTime = 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
}
