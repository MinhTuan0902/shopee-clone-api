import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { ENVVariable, NodeENV } from '../env/env.constant';
import { ENVService } from '../env/env.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ENVService],
      useFactory: (envService: ENVService): MongooseModuleOptions => {
        const nodeENV = envService.get(ENVVariable.NodeENV);
        return {
          uri:
            nodeENV === NodeENV.Develop
              ? envService.get(ENVVariable.MongoURIDevelop)
              : envService.get(ENVVariable.MongoURIProduction),
        };
      },
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      autoSchemaFile: {
        path: join(process.cwd(), 'graphql/schema.gql'),
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: ({ connectionParams }) => {},
        },
      },
    }),

    JwtModule.registerAsync({
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
