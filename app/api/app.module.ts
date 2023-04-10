import { GraphQLUnauthorizedError } from '@common/error/graphql.error';
import { ENVVariable, NodeENV } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { GraphQLFormattedError } from 'graphql';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { FeedbackModule } from './feedback/feedback.module';
import { GeoModule } from './geo/geo.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShopeeSettingModule } from './setting/setting.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
      autoSchemaFile: {
        path: join(process.cwd(), 'generated/schema.gql'),
      },
      formatError: (
        formattedError: GraphQLFormattedError,
      ): GraphQLFormattedError => {
        delete formattedError.extensions.stacktrace;
        return formattedError;
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            const authHeader = connectionParams?.authorization;
            if (!authHeader) {
              throw new GraphQLUnauthorizedError();
            }

            return {
              req: {
                headers: {
                  authorization: authHeader,
                },
              },
            };
          },
        },
      },
    }),

    MongooseModule.forRootAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): MongooseModuleOptions => {
        const nodeENV = envService.get(ENVVariable.NodeENV);
        return {
          uri:
            nodeENV === NodeENV.Development
              ? envService.get(ENVVariable.MongoURIDevelop)
              : envService.get(ENVVariable.MongoURIProduction),
        };
      },
    }),

    JwtModule.registerAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): JwtModuleOptions => {
        return {
          secret: envService.get(ENVVariable.JWTSecret),
        };
      },
    }),

    // API Modules
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ShopeeSettingModule,
    GeoModule,
    FeedbackModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AppModule {}
