export const coins = {
  ETH: 'Ethereum',
  SUB: 'Substratum',
  BTC: 'Bitcoin',
  LTC: 'Litecoin'
}

export const TIME_INCREMENTS = {
  HALF_SECOND: 500,
  TWO_SECONDS: 2000,
  ONE_MINUTE: 60000,
  FIVE_MINUTES: 300000,
  FIFTEEN_MINUTES: 900000,
  TWENTY_MINUTES: 1200000

}

export const VERIFICATION_LEVEL = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3
}

export const ORDER_STATUS = {
  ALL: { value: 0, labelKey: 'enums.ORDER_STATUS.ALL' },
  WORKING: { value: 1, labelKey: 'enums.ORDER_STATUS.WORKING' },
  REJECTED: { value: 2, labelKey: 'enums.ORDER_STATUS.REJECTED' },
  CANCELED: { value: 3, labelKey: 'enums.ORDER_STATUS.CANCELED' },
  EXPIRED: { value: 4, labelKey: 'enums.ORDER_STATUS.EXPIRED' },
  FULLY_EXECUTED: { value: 5, labelKey: 'enums.ORDER_STATUS.FULLY_EXECUTED' },
  ACCEPTED: { value: 6, labelKey: 'enums.ORDER_STATUS.ACCEPTED' },
  PARTIALLY_FILLED: { value: -1, labelKey: 'enums.ORDER_STATUS.PARTIALLY_FILLED' }
}

export const ORDER_LABELS = {
  WORKING: 'Working',
  REJECTED: 'Rejected',
  CANCELED: 'Cancelled',
  EXPIRED: 'Expired',
  FULLY_EXECUTED: 'FullyExecuted',
  ACCEPTED: 'Accepted'
}

export const TRANSACTION_TYPE = {
  DEPOSIT: { value: 'deposit', labelKey: 'enums.TRANSACTION_TYPE.DEPOSIT' },
  WITHDRAWAL: { value: 'withdrawal', labelKey: 'enums.TRANSACTION_TYPE.WITHDRAWAL' },
  TRANSFER: { value: 'transfer', labelKey: 'enums.TRANSACTION_TYPE.TRANSFER' }
}

export const TRANSACTION_SIDE = {
  BUY: { value: 0, labelKey: 'shared.BUY' },
  SELL: { value: 1, labelKey: 'shared.SELL' },
  SHORT: { value: 2, labelKey: null },
  UNKNOWN: { value: 3, labelKey: null }
}

export const ORDER_TYPE = {
  MARKET: { value: 1, labelKey: 'shared.MARKET' },
  LIMIT: { value: 2, labelKey: 'shared.LIMIT' },
  STOP: { value: 3, labelKey: 'shared.STOP' }
}

export const PEG_PRICE = {
  LAST: { value: 1 },
  BID: { value: 2 },
  ASK: { value: 3 },
  MIDPOINT: { value: 4 }
}

export const FEE_TYPE = {
  MAKER: { value: 1 },
  TAKER: { value: 2 }
}

export const actions = {
  pay: 'Sent',
  sell: 'Sold',
  buy: 'Bought',
  transfer: 'Withdrew'
}

export const actionIcons = {
  pay: 'icon-action__buy.svg',
  sell: 'icon-action__sell.svg',
  buy: 'icon-action__sell.svg',
  transfer: 'icon-action__transfer.svg'
}

export const TIME_IN_FORCE = {
  UNKNOWN: { value: 0, labelKey: null, description: 'unknown (error condition)' },
  GTC: { value: 1, labelKey: 'shared.GOOD_TIL_CANCELED', description: 'good til canceled' },
  OPG: { value: 2, labelKey: null, description: 'execute as close to opening price as possible' },
  IOC: { value: 3, labelKey: null, description: 'immediate or canceled' },
  FOK: { value: 4, labelKey: null, description: 'fill or kill' },
  GTX: { value: 5, labelKey: null, description: 'good til executed' },
  GTD: { value: 6, labelKey: 'shared.GOOD_TODAY', description: 'good til date' }
}

export const DEPOSIT_STATUS = {
  NEW: { value: 0, labelKey: 'enums.DEPOSIT_STATUS.NEW', description: 'New ticket awaiting operator review' },
  ADMIN_PROCESSING: { value: 1, labelKey: 'enums.DEPOSIT_STATUS.ADMIN_PROCESSING', description: 'An admin is looking at the ticket' },
  ACCEPTED: { value: 2, labelKey: 'enums.DEPOSIT_STATUS.ACCEPTED', description: 'An admin accepts the ticket' },
  REJECTED: { value: 3, labelKey: 'enums.DEPOSIT_STATUS.REJECTED', description: 'Admin rejects the ticket' },
  SYSTEM_PROCESSING: { value: 4, labelKey: 'enums.DEPOSIT_STATUS.SYSTEM_PROCESSING', description: 'Automatic processing; an unlikely status for a deposit' },
  FULLY_PROCESSED: { value: 5, labelKey: 'enums.DEPOSIT_STATUS.FULLY_PROCESSED', description: 'The deposit has concluded' },
  FAILED: { value: 6, labelKey: 'enums.DEPOSIT_STATUS.FAILED', description: 'The deposit failed for some reason' },
  PENDING: { value: 7, labelKey: 'enums.DEPOSIT_STATUS.PENDING', description: 'Account Provider has set status to pending' },
  CONFIRMED: { value: 8, labelKey: 'enums.DEPOSIT_STATUS.CONFIRMED', description: 'Account Provider confirms the deposit' },
  AML_PROCESSING: { value: 9, labelKey: 'enums.DEPOSIT_STATUS.AML_PROCESSING', description: 'Anti-Money-Laundering process underway' },
  AML_ACCEPTED: { value: 10, labelKey: 'enums.DEPOSIT_STATUS.AML_ACCEPTED', description: 'Anti-Money-Laundering process successful' },
  AML_REJECTED: { value: 11, labelKey: 'enums.DEPOSIT_STATUS.AML_REJECTED', description: 'Deposit did not stand up to Anti-Money-Laundering process' },
  AML_FAILED: { value: 12, labelKey: 'enums.DEPOSIT_STATUS.AML_FAILED', description: 'Anti-Money-Laundering process failed/did not complete' },
  LIMITS_ACCEPTED: { value: 13, labelKey: 'enums.DEPOSIT_STATUS.LIMITS_ACCEPTED', description: 'Deposit meets limits for fiat or crypto asset' },
  LIMITS_REJECTED: { value: 14, labelKey: 'enums.DEPOSIT_STATUS.LIMITS_REJECTED', description: 'Deposit does not meet limits for fiat or crypto asset' }
}

export const WITHDRAWAL_STATUS = {
  NEW: { value: 0, labelKey: 'enums.WITHDRAWAL_STATUS.NEW', description: 'Awaiting operator review' },
  ADMIN_PROCESSING: { value: 1, labelKey: 'enums.WITHDRAWAL_STATUS.ADMIN_PROCESSING', description: 'An admin is looking at the ticket' },
  ACCEPTED: { value: 2, labelKey: 'enums.WITHDRAWAL_STATUS.ACCEPTED', description: 'Withdrawal will proceed' },
  REJECTED: { value: 3, labelKey: 'enums.WITHDRAWAL_STATUS.REJECTED', description: 'Admin or automatic rejection' },
  SYSTEM_PROCESSING: { value: 4, labelKey: 'enums.WITHDRAWAL_STATUS.SYSTEM_PROCESSING', description: 'Automatic processing underway' },
  FULLY_PROCESSED: { value: 5, labelKey: 'enums.WITHDRAWAL_STATUS.FULLY_PROCESSED', description: 'The withdrawal has concluded' },
  FAILED: { value: 6, labelKey: 'enums.WITHDRAWAL_STATUS.FAILED', description: 'The withdrawal failed for some reason' },
  PENDING: { value: 7, labelKey: 'enums.WITHDRAWAL_STATUS.PENDING', description: 'The admin has placed the withdrawal in pending status' },
  PENDING_2FA: { value: 8, labelKey: 'enums.WITHDRAWAL_STATUS.PENDING_2FA', description: 'User must click 2-factor authentication confirmation link' },
  AUTO_ACCEPTED: { value: 9, labelKey: 'enums.WITHDRAWAL_STATUS.AUTO_ACCEPTED', description: 'Withdrawal will be automatically processed' },
  DELAYED: { value: 10, labelKey: 'enums.WITHDRAWAL_STATUS.DELAYED', description: 'Waiting for funds to be allocated for the withdrawal' },
  USER_CANCELED: { value: 11, labelKey: 'enums.WITHDRAWAL_STATUS.USER_CANCELED', description: 'Withdraw canceled by user or Superuser' },
  ADMIN_CANCELED: { value: 12, labelKey: 'enums.WITHDRAWAL_STATUS.ADMIN_CANCELED', description: 'Withdraw canceled by Superuser' },
  AML_PROCESSING: { value: 13, labelKey: 'enums.WITHDRAWAL_STATUS.AML_PROCESSING', description: 'Anti-Money-Laundering process underway' },
  AML_ACCEPTED: { value: 14, labelKey: 'enums.WITHDRAWAL_STATUS.AML_ACCEPTED', description: 'Anti-Money-Laundering process complete' },
  AML_REJECTED: { value: 15, labelKey: 'enums.WITHDRAWAL_STATUS.AML_REJECTED', description: 'Withdrawal did not stand up to Anti-Money-Laundering process' },
  AML_FAILED: { value: 16, labelKey: 'enums.WITHDRAWAL_STATUS.AML_FAILED', description: 'Withdrawal did not complete Anti-Money-Laundering process' },
  LIMITS_ACCEPTED: { value: 17, labelKey: 'enums.WITHDRAWAL_STATUS.LIMITS_ACCEPTED', description: 'Withdrawal meets limits for fiat or crypto asset' },
  LIMITS_REJECTED: { value: 18, labelKey: 'enums.WITHDRAWAL_STATUS.LIMITS_REJECTED', description: 'Withdrawal does not meet limits for fiat or crypto asset' },
  SUBMITTED: { value: 19, labelKey: 'enums.WITHDRAWAL_STATUS.SUBMITTED', description: 'Withdrawal sent to Account Provider; awaiting blockchain confirmation' },
  CONFIRMED: { value: 20, labelKey: 'enums.WITHDRAWAL_STATUS.CONFIRMED', description: 'Account Provider confirms that withdrawal is on the blockchain' },
  MANUALLY_CONFIRMED: { value: 21,
    labelKey: 'enums.WITHDRAWAL_STATUS.MANUALLY_CONFIRMED',
    description: 'Admin has sent withdrawal via wallet or admin function directly; marks ticket as FullyProcessed; debits account' },
  CONFIRMED_2FA: { value: 22, labelKey: 'enums.WITHDRAWAL_STATUS.CONFIRMED_2FA', description: 'User has confirmed withdraw via 2-factor authentication' }
}

export const TRANSFER_STATUS = {
  CREDIT: { value: 0, labelKey: 'enums.TRANSFER_STATUS.CREDIT', description: 'Credit to your account' },
  DEBIT: { value: 1, labelKey: 'enums.TRANSFER_STATUS.DEBIT', description: 'Debit from your account' }
}

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  DECLINED: 'Declined'
}

export const DEFAULT_WALLETS = [
  'ADA',
  'AMPX',
  'BAT',
  'BCH',
  'BTC',
  'DASH',
  'EOS',
  'ETC',
  'ETH',
  'MIOTA',
  'LTC',
  'NEO',
  'REP',
  'TRX',
  'USD',
  'XLM',
  'XRP',
  'ZRX'
]

export const FIAT_COINS = [
  'USD',
  'EUR'
]

export const COIN_WITHOUT_VALIDATION = [
  'AMPX',
  'LTC',
  'BAT',
  'REP',
  'ZRX',
  'EOS',
  'USDT',
  'XTZ',
  '1UP'
]

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSIBLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
}

export const CYS_STATUS = {
  PENDING: 'request.pending'
}

export const MIN_TRADE_SIZE = {
  ADA: 90,
  BAT: 25,
  BCH: 0.03,
  BTC: 0.001,
  DASH: 0.05,
  EOS: 1,
  ETC: 0.8,
  ETH: 0.05,
  LTC: 0.1,
  MIOTA: 18,
  NEO: 0.5,
  QTUM: 3,
  REP: 0.5,
  TRX: 300,
  XLM: 70,
  XRP: 30,
  XTZ: 5,
  ZRX: 30
}

export const ERROR_MESSAGES = {
  INVALID_IBAN: 'a valid IBAN is required'
}

export const ALERT_SUBJECT = {
  USER_INFO_UPDATED: 'user info updated'
}
