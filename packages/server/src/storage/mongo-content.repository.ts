import { Injectable, Optional } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { AuthorEntity } from './schemas/author.schema'
import { EntitlementEntity } from './schemas/entitlement.schema'
import { FollowEntity } from './schemas/follow.schema'
import { LiveEventEntity } from './schemas/live-event.schema'
import { LiveStatEntity } from './schemas/live-stat.schema'
import { MatchEntity } from './schemas/match.schema'
import { OrderEntity } from './schemas/order.schema'
import { ReportEntity } from './schemas/report.schema'
import { UserEntity } from './schemas/user.schema'
import type {
  PersistedAuthor,
  PersistedEntitlement,
  PersistedFollow,
  PersistedLiveEvent,
  PersistedLiveStat,
  PersistedMatch,
  PersistedOrder,
  PersistedReport,
  PersistedUser,
} from './storage.types'

@Injectable()
export class MongoContentRepository {
  constructor(
    @Optional()
    @InjectModel(ReportEntity.name)
    private readonly reportModel?: Model<ReportEntity>,
    @Optional()
    @InjectModel(OrderEntity.name)
    private readonly orderModel?: Model<OrderEntity>,
    @Optional()
    @InjectModel(EntitlementEntity.name)
    private readonly entitlementModel?: Model<EntitlementEntity>,
    @Optional()
    @InjectModel(UserEntity.name)
    private readonly userModel?: Model<UserEntity>,
    @Optional()
    @InjectModel(AuthorEntity.name)
    private readonly authorModel?: Model<AuthorEntity>,
    @Optional()
    @InjectModel(MatchEntity.name)
    private readonly matchModel?: Model<MatchEntity>,
    @Optional()
    @InjectModel(LiveEventEntity.name)
    private readonly liveEventModel?: Model<LiveEventEntity>,
    @Optional()
    @InjectModel(LiveStatEntity.name)
    private readonly liveStatModel?: Model<LiveStatEntity>,
    @Optional()
    @InjectModel(FollowEntity.name)
    private readonly followModel?: Model<FollowEntity>,
  ) {}

  isReady(): boolean {
    return Boolean(
      this.reportModel &&
        this.orderModel &&
        this.entitlementModel &&
        this.userModel &&
        this.authorModel &&
        this.matchModel &&
        this.liveEventModel &&
        this.liveStatModel &&
        this.followModel,
    )
  }

  async countUsers(): Promise<number> {
    if (!this.userModel) {
      return 0
    }
    return this.userModel.countDocuments().exec()
  }

  async seedUsers(users: PersistedUser[]): Promise<void> {
    if (!this.userModel || users.length === 0) {
      return
    }
    await this.userModel.bulkWrite(
      users.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    )
  }

  async listUsers(): Promise<PersistedUser[]> {
    if (!this.userModel) {
      return []
    }
    return this.userModel.find().lean<PersistedUser[]>().exec()
  }

  async upsertUser(user: PersistedUser): Promise<void> {
    if (!this.userModel) {
      return
    }
    await this.userModel.updateOne({ id: user.id }, { $set: user }, { upsert: true }).exec()
  }

  async countAuthors(): Promise<number> {
    if (!this.authorModel) {
      return 0
    }
    return this.authorModel.countDocuments().exec()
  }

  async seedAuthors(authors: PersistedAuthor[]): Promise<void> {
    if (!this.authorModel || authors.length === 0) {
      return
    }
    await this.authorModel.bulkWrite(
      authors.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    )
  }

  async listAuthors(): Promise<PersistedAuthor[]> {
    if (!this.authorModel) {
      return []
    }
    return this.authorModel.find().lean<PersistedAuthor[]>().exec()
  }

  async upsertAuthor(author: PersistedAuthor): Promise<void> {
    if (!this.authorModel) {
      return
    }
    await this.authorModel
      .updateOne({ id: author.id }, { $set: author }, { upsert: true })
      .exec()
  }

  async countMatches(): Promise<number> {
    if (!this.matchModel) {
      return 0
    }
    return this.matchModel.countDocuments().exec()
  }

  async seedMatches(matches: PersistedMatch[]): Promise<void> {
    if (!this.matchModel || matches.length === 0) {
      return
    }
    await this.matchModel.bulkWrite(
      matches.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    )
  }

  async listMatches(): Promise<PersistedMatch[]> {
    if (!this.matchModel) {
      return []
    }
    return this.matchModel.find().lean<PersistedMatch[]>().exec()
  }

  async countLiveEvents(): Promise<number> {
    if (!this.liveEventModel) {
      return 0
    }
    return this.liveEventModel.countDocuments().exec()
  }

  async seedLiveEvents(events: PersistedLiveEvent[]): Promise<void> {
    if (!this.liveEventModel || events.length === 0) {
      return
    }
    await this.liveEventModel.bulkWrite(
      events.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    )
  }

  async listLiveEvents(): Promise<PersistedLiveEvent[]> {
    if (!this.liveEventModel) {
      return []
    }
    return this.liveEventModel.find().lean<PersistedLiveEvent[]>().exec()
  }

  async countLiveStats(): Promise<number> {
    if (!this.liveStatModel) {
      return 0
    }
    return this.liveStatModel.countDocuments().exec()
  }

  async seedLiveStats(stats: PersistedLiveStat[]): Promise<void> {
    if (!this.liveStatModel || stats.length === 0) {
      return
    }
    await this.liveStatModel.bulkWrite(
      stats.map((item) => ({
        updateOne: {
          filter: { matchId: item.matchId },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    )
  }

  async listLiveStats(): Promise<PersistedLiveStat[]> {
    if (!this.liveStatModel) {
      return []
    }
    return this.liveStatModel.find().lean<PersistedLiveStat[]>().exec()
  }

  async listFollowsByUser(userId: string): Promise<PersistedFollow[]> {
    if (!this.followModel) {
      return []
    }
    return this.followModel.find({ userId }).lean<PersistedFollow[]>().exec()
  }

  async listAllFollows(): Promise<PersistedFollow[]> {
    if (!this.followModel) {
      return []
    }
    return this.followModel.find().lean<PersistedFollow[]>().exec()
  }

  async upsertFollow(follow: PersistedFollow): Promise<void> {
    if (!this.followModel) {
      return
    }
    await this.followModel
      .updateOne(
        {
          userId: follow.userId,
          targetType: follow.targetType,
          targetId: follow.targetId,
        },
        { $setOnInsert: follow },
        { upsert: true },
      )
      .exec()
  }

  async countReports(): Promise<number> {
    if (!this.reportModel) {
      return 0
    }
    return this.reportModel.countDocuments().exec()
  }

  async seedReports(reports: PersistedReport[]): Promise<void> {
    if (!this.reportModel || reports.length === 0) {
      return
    }
    await this.reportModel.bulkWrite(
      reports.map((report) => ({
        updateOne: {
          filter: { id: report.id },
          update: { $setOnInsert: report },
          upsert: true,
        },
      })),
    )
  }

  async listReports(): Promise<PersistedReport[]> {
    if (!this.reportModel) {
      return []
    }
    return this.reportModel.find().lean<PersistedReport[]>().exec()
  }

  async findReportById(reportId: string): Promise<PersistedReport | null> {
    if (!this.reportModel) {
      return null
    }
    return this.reportModel.findOne({ id: reportId }).lean<PersistedReport | null>().exec()
  }

  async upsertReport(report: PersistedReport): Promise<void> {
    if (!this.reportModel) {
      return
    }
    await this.reportModel
      .updateOne({ id: report.id }, { $set: report }, { upsert: true })
      .exec()
  }

  async findPendingOrder(userId: string, reportId: string): Promise<PersistedOrder | null> {
    if (!this.orderModel) {
      return null
    }
    return this.orderModel
      .findOne({ userId, reportId, status: 'pending' })
      .lean<PersistedOrder | null>()
      .exec()
  }

  async findOrderByNoAndUser(orderNo: string, userId: string): Promise<PersistedOrder | null> {
    if (!this.orderModel) {
      return null
    }
    return this.orderModel
      .findOne({ orderNo, userId })
      .lean<PersistedOrder | null>()
      .exec()
  }

  async createOrder(order: PersistedOrder): Promise<void> {
    if (!this.orderModel) {
      return
    }
    await this.orderModel.create(order)
  }

  async upsertOrder(order: PersistedOrder): Promise<void> {
    if (!this.orderModel) {
      return
    }
    await this.orderModel
      .updateOne({ id: order.id }, { $set: order }, { upsert: true })
      .exec()
  }

  async listEntitlementsByUser(userId: string): Promise<PersistedEntitlement[]> {
    if (!this.entitlementModel) {
      return []
    }
    return this.entitlementModel
      .find({ userId })
      .lean<PersistedEntitlement[]>()
      .exec()
  }

  async findEntitlement(
    userId: string,
    reportId: string,
  ): Promise<PersistedEntitlement | null> {
    if (!this.entitlementModel) {
      return null
    }
    return this.entitlementModel
      .findOne({ userId, reportId })
      .lean<PersistedEntitlement | null>()
      .exec()
  }

  async createEntitlement(entitlement: PersistedEntitlement): Promise<void> {
    if (!this.entitlementModel) {
      return
    }
    await this.entitlementModel
      .updateOne(
        { userId: entitlement.userId, reportId: entitlement.reportId },
        { $setOnInsert: entitlement },
        { upsert: true },
      )
      .exec()
  }
}
