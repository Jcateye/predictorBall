import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { DataStoreService } from './core/data-store.service'
import { AuthService } from './auth/auth.service'
import { AuthController } from './auth/auth.controller'
import { ScheduleController } from './schedule/schedule.controller'
import { MatchesController } from './matches/matches.controller'
import { LiveController } from './live/live.controller'
import { FeedController } from './feed/feed.controller'
import { ReportsController } from './reports/reports.controller'
import { OrdersController } from './orders/orders.controller'
import { PaymentsController } from './payments/payments.controller'
import { MeController } from './me/me.controller'
import { FollowsController } from './follows/follows.controller'
import { AuthorsController } from './authors/authors.controller'
import { InsightsController } from './insights/insights.controller'
import { MockAuthGuard } from './auth/mock-auth.guard'
import { MongoContentRepository } from './storage/mongo-content.repository'
import { ReportEntity, ReportSchema } from './storage/schemas/report.schema'
import { OrderEntity, OrderSchema } from './storage/schemas/order.schema'
import {
  EntitlementEntity,
  EntitlementSchema,
} from './storage/schemas/entitlement.schema'
import { UserEntity, UserSchema } from './storage/schemas/user.schema'
import { AuthorEntity, AuthorSchema } from './storage/schemas/author.schema'
import { MatchEntity, MatchSchema } from './storage/schemas/match.schema'
import {
  LiveEventEntity,
  LiveEventSchema,
} from './storage/schemas/live-event.schema'
import { LiveStatEntity, LiveStatSchema } from './storage/schemas/live-stat.schema'
import { FollowEntity, FollowSchema } from './storage/schemas/follow.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ...((process.env.USE_MONGO ?? 'false').toLowerCase() === 'true'
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('mongodbUri'),
            }),
            inject: [ConfigService],
          }),
          MongooseModule.forFeature([
            { name: ReportEntity.name, schema: ReportSchema },
            { name: OrderEntity.name, schema: OrderSchema },
            { name: EntitlementEntity.name, schema: EntitlementSchema },
            { name: UserEntity.name, schema: UserSchema },
            { name: AuthorEntity.name, schema: AuthorSchema },
            { name: MatchEntity.name, schema: MatchSchema },
            { name: LiveEventEntity.name, schema: LiveEventSchema },
            { name: LiveStatEntity.name, schema: LiveStatSchema },
            { name: FollowEntity.name, schema: FollowSchema },
          ]),
        ]
      : []),
  ],
  controllers: [
    AppController,
    AuthController,
    ScheduleController,
    MatchesController,
    LiveController,
    FeedController,
    ReportsController,
    OrdersController,
    PaymentsController,
    MeController,
    FollowsController,
    AuthorsController,
    InsightsController,
  ],
  providers: [
    AppService,
    DataStoreService,
    AuthService,
    MockAuthGuard,
    MongoContentRepository,
  ],
})
export class AppModule {}
