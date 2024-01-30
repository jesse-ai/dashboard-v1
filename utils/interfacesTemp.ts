// ==================== Strategy ====================

interface StrategiesResponse {
    strategies: Strategy[];
}

interface StrategyResponse {
    strategy: Strategy;
    strategy_metrics: StrategyMetrics[];
}

interface Strategy {
    id: string;
    slug: string;
    name: string;
    description: string;
    timeframe: string;
    symbol: string;
    url: string;
    type: string;
    price: number;
    created_at: Date;
    updated_at: Date;
    user_id: string | null;
    strategy_metrics: StrategyMetrics;
}

interface StrategyMetrics {
    id: string;
    strategy_id: string;
    quantstats_path: string;
    charts_path: string;
    logs_path: string;
    json_metrics: any; // or specify the JSON structure if known
    equity_curve: string;
    average_win_loss: number;
    starting_date: Date;
    finishing_date: Date;
    exchange: string;
    symbol: string;
    timeframe: string;
    created_at: Date;
    updated_at: Date;
    total_completed_trades: number;
    total_winning_trades: number;
    total_losing_trades: number;
    starting_balance: number;
    finishing_balance: number;
    win_rate: number;
    ratio_avg_win_loss: number;
    longs_count: number;
    longs_percentage: number;
    shorts_percentage: number;
    shorts_count: number;
    fee: number;
    net_profit: number;
    net_profit_percentage: number;
    average_win: number;
    average_loss: number;
    expectancy: number;
    expectancy_percentage: number;
    expected_net_profit: number;
    average_holding_period: number;
    gross_profit: number;
    gross_loss: number;
    max_drawdown: number;
    annual_return: number;
    sharpe_ratio: number;
    calmar_ratio: number;
    sortino_ratio: number;
    omega_ratio: number;
    serenity_index: number;
    smart_sharpe: number;
    smart_sortino: number;
    total_open_trades: number;
    open_pl: number;
    winning_streak: number;
    losing_streak: number;
    largest_losing_trade: number;
    largest_winning_trade: number;
    current_streak: number;
    status: string;
    error: string | null;
}

// ==================== Releases ====================

interface Release {
    id: number;
    version: string;
    description: string;
    published: boolean;
    is_beta: boolean;
    major: number;
    minor: number;
    patch: number;
    created_at: Date;
}

interface ReleasesResponseLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ReleasesResponseMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: ReleasesResponseLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface ReleasesResponse {
    data: Release[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string;
    };
    meta: ReleasesResponseMeta;
}

// ==================== Help Center ====================
interface HelpItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    views: number;
    category_id: number;
    created_at: string;
    updated_at: string;
    tags: HelpTag[];
    url: string;
}

interface HelpTag {
    id: number;
    name: string;
    slug: string;
}

interface HelpCategory {
    id: number;
    title: string;
    slug: string;
}

interface HelpIndexResponse {
    helps: HelpItem[];
    categories: HelpCategory[];
}

interface HelpCategoryIndexResponse {
    helps: HelpItem[];
    category: HelpCategory;
}

// ==================== Blog ====================

interface User {
    id: number;
    name: string;
    profile_photo_url: string;
}

interface BlogCategory {
    id: number;
    name: string;
    slug: string;
}

interface BlogArticle {
    title: string;
    thumbnail: string;
    featured_image: string;
    user: User;
    category: BlogCategory;
    slug: string;
    published: boolean;
    body: string;
    description: string;
    views: number;
    created_at: Date;
}

interface BlogResponseLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string;
}

interface BlogResponseMetaLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BlogResponseMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: BlogResponseMetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface BlogResponse {
    data: BlogArticle[];
    links: BlogResponseLinks;
    meta: BlogResponseMeta;
}

// ==================== Auth ====================

interface BearerToken {
    access_token: string;
    user: AuthUser;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    ip_address_limit: number;
    is_affiliate: boolean;
    email_verified_at: string;
    profile_photo_url: string;
    is_admin: boolean;
    license_plan: string;
    two_factor_auth: boolean;
    created_at: Date;
}

interface EmailVerificationResponse {
    message: string;
    user: AuthUser;
}

interface SubscriptionConfirmationResponse {
    message: string;
}

interface UpdateProfileResponse {
    message: string;
    user: AuthUser;
}

interface TwoFactorAuthEnabledResponse {
    message: string;
    qrImage: string;
}

// ==================== License ====================
interface OrderHistory {
    plan: string;
    orders: Order[];
}

interface Order {
    id: number;
    product_name: string;
    price: number;
    paid: boolean;
    active: boolean;
    updated_at: Date;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    discount_percent: number;
    price: number;
    duration: string;
}

interface PricingResponse {
    product_livetrade: Product;
    referral_coupon: Coupon;
    payment_address: string;
}

interface Coupon {
    id: number;
    name: string;
    remaining_usage: number;
    discount_percent: number;
}

interface OrderResponse {
    status: string;
    message?: string;
    txn_id: null | string;
    invoice_url: null | string;
    order_id: null | string;
}

interface ConfirmCouponResponse {
    message: string;
    coupon: Coupon;
}

interface PaymentResultResponse {
    order: Order;
    status: string;
}

// ==================== ApiToken ====================
interface ApiToken {
    id: number;
    created_at: string;
    ip_address: string;
    name: string;
}

interface ApiTokenResponse {
    tokens: ApiToken[];
}

interface TokenCreationResponse {
    message: string;
    token: ApiToken;
    access_token: string;
}

// ==================== Referral ====================
interface ReferralsResponse {
    id: number;
    url: string;
    user_commission: number;
    total_income: number;
    sales_count: number;
    visits_count: number;
    registers_count: number;
    min_friend_purchase_count: number;
    actions: ReferralAction[];
    withdrawals: ReferralWithdrawal[];
}

interface ReferralWithdrawalResponse {
    message: string;
    withdrawal: ReferralWithdrawal;
}

interface ReferralWithdrawal {
    id: string;
    amount: number;
    status: string;
    created_at: Date;
    coin: string;
    wallet_address: string;
    transaction_id?: string;
    description?: string;
}

interface ReferralAction {
    action_type: string;
    price: number;
    user_commission: number;
    user_email: string;
    created_at: Date;
}
