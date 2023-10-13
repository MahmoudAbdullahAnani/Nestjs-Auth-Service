import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATA_BASE_HOST,
      port: +process.env.DATA_BASE_PORT,
      username: process.env.DATA_BASE_USERNAME,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: process.env.NODE_MODE === 'development' ? true : false,
    }),
    UsersModule,
  ],
})
export class AppModule {}
