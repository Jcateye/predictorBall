export type {
  ApiResponse,
  PaginationMeta,
  ResponseMeta,
  HealthCheckResponse,
} from './types/api'
export type {
  UserRole,
  AuthorType,
  MatchStatus,
  ReportVisibility,
  ReportType,
  PriceType,
  ConfidenceLevel,
  OrderStatus,
  AuthUser,
  JwtPayload,
  TeamBrief,
  MatchCard,
  LiveEventDto,
  LiveStatDto,
  FeedQuery,
  FeedAuthor,
  FeedItem,
  ReportDetailDto,
  ReportUpdateDto,
  ReportRecommendationsDto,
  InsightSignalDto,
  InsightReportDto,
  CreateOrderDto,
  OrderDto,
  PaymentConfirmDto,
  EntitlementDto,
  FollowDto,
  CreateReportUpdateDto,
  ReminderDto,
  PublishReportDto,
  RiskCheckResultDto,
  AuthorProfileDto,
} from './types/domain'

export const API_PREFIX = '/api'

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const
