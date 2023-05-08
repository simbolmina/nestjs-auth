// database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { currentConfig } from '../../db-config';

@Module({
  imports: [TypeOrmModule.forRoot(currentConfig)],
})
export class DatabaseModule {}

// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => {
//         return {
//           type: 'postgres',
//           host: configService.get<string>('DB_HOST'),
//           port: parseInt(configService.get<string>('DB_PORT'), 10),
//           database: configService.get<string>('DB_DATABASE'),
//           username: configService.get<string>('DB_USERNAME'),
//           password: configService.get<string>('DB_PASSWORD'),
//           entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//           synchronize: true,
//         };
//       },
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}

// import { DynamicModule, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({})
// export class DatabaseModule {
//   static forRoot(connectionName = 'default'): DynamicModule {
//     return {
//       module: DatabaseModule,
//       imports: [
//         TypeOrmModule.forRootAsync({
//           name: connectionName,
//           imports: [ConfigModule],
//           useFactory: async (configService: ConfigService) => {
//             return {
//               type: 'postgres',
//               host: configService.get<string>('DB_HOST'),
//               port: parseInt(configService.get<string>('DB_PORT'), 10),
//               database: configService.get<string>('DB_DATABASE'),
//               username: configService.get<string>('DB_USERNAME'),
//               password: configService.get<string>('DB_PASSWORD'),
//               entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//               synchronize: true,
//             };
//           },
//           inject: [ConfigService],
//         }),
//       ],
//     };
//   }
// }
