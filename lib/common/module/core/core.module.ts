import { GraphQLUnauthorizedError } from '@common/error/graphql.error';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { ENVVariable, NodeENV } from '../env/env.constant';
import { ENVModule } from '../env/env.module';
import { ENVService } from '../env/env.service';

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
      definitions: {
        path: join(process.cwd(), 'generated/schema.ts'),
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
          onConnect: ({ connectionParams }) => {
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
  ],
})
export class CoreModule {}
