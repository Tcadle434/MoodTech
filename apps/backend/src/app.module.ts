import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoodsModule } from './moods/moods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST') || 'localhost',
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get('DATABASE_USERNAME') || 'postgres',
        password: configService.get('DATABASE_PASSWORD') || 'postgres',
        database: configService.get('DATABASE_NAME') || 'moodtech',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        // Add this to ensure PostgreSQL handles enums correctly
        extra: {
          trustServerCertificate: true,
        },
        // Automatically create the enum type in the database
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MoodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
