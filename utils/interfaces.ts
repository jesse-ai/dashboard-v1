// ==================== general info ====================
interface GeneralInfoResponse {
    exchanges: Exchange[];
    has_live_plugin_installed: boolean;
    jesse_supported_timeframes: never[];
    plan_info: PlanInfo;
    strategies: never[];
    system_info: SystemInfo;
    update_info: UpdateInfo;
}

interface SystemInfo {
    cpu_cores: number;
    is_docker: boolean;
    jesse_version: string;
    operating_system: string;
    python_version: string;
    live_plugin_version?: string
}

interface PlanInfo {
    plan: string
}

interface UpdateInfo {
    is_update_info_available: boolean;
    jesse_latest_version: string;
    jesse_live_latest_version: string
}

// ==================== exchanges ====================
interface Exchange {
    fee: number;
    modes: {
        backtesting: boolean;
        live_trading: boolean
    };
    name: string;
    required_live_plan: string;
    supported_leverage_modes: string[];
    supported_timeframes: string[];
    type: string;
    url: string;
}

// ==================== settings ====================
interface Logging {
    order_submission: boolean;
    order_cancellation: boolean;
    order_execution: boolean;
    position_opened: boolean;
    position_increased: boolean;
    position_reduced: boolean;
    position_closed: boolean;
    shorter_period_candles: boolean;
    trading_candles: boolean;
    balance_update: boolean;
}

interface Notifications {
    enabled: boolean;
    position_report_timeframe: string;
    events: {
        errors: boolean;
        started_session: boolean;
        terminated_session: boolean;
        submitted_orders: boolean;
        cancelled_orders: boolean;
        executed_orders: boolean;
        opened_position: boolean;
        updated_position: boolean;
    };
}

interface Backtest {
    logging: Logging;
    warm_up_candles: number;
    exchanges: any; // Replace with actual type
}

interface Live {
    persistency: boolean;
    generate_candles_from_1m: boolean;
    logging: Logging;
    warm_up_candles: number;
    exchanges: any; // Replace with actual type
    notifications: Notifications;
}

interface Optimization {
    cpu_cores: number;
    ratio: string;
    warm_up_candles: number;
    exchange: {
        balance: number;
        fee: number;
        type: string;
        futures_leverage: number;
        futures_leverage_mode: string;
    };
}

interface Settings {
    backtest: Backtest;
    live: Live;
    optimization: Optimization;
}
// ==================== get config ====================
interface GetConfigResponse {
    data: {
        data: Settings;
    }
}
// ==================== auth Response ====================
interface AuthResponse {
    auth_token: string;
}
// ==================== FAQ Response ====================
interface FAQResponse {
    data?: FAQ[];
}

interface FAQ {
    id: number;
    title: string;
    slug: string;
    description: string;
    faq_category_id: number;
    published: boolean;
    created_at: Date;
    updated_at: Date;
    views: number;
}
// ==================== Make Strategy Response ====================
interface MakeStrategyResponse {
    message: string;
    status: string;
}
// ==================== positions Event ====================
interface positionsEvent {
    currency: string;
    current_price: number;
    entry: number;
    leverage: number;
    liquidation_price: number | null;
    opened_at: number;
    pnl: number;
    pnl_perc: number;
    qty: number;
    strategy_name: string;
    symbol: string;
    type: string;
    value: number;
}
// ==================== orders Event ====================
interface ordersEvent {
    canceled_at: number | null;
    created_at: number;
    exchange_id: string;
    executed_at: number | null;
    filled_qty: number;
    id: string;
    price: number;
    qty: number;
    session_id: string | null;
    side: string;
    status: string;
    symbol: string;
    type: string;
}
// ==================== general Info Event ====================
interface generalInfoEvent {
    started_at: number;
    current_time: number;
    started_balance: number;
    current_balance: number;
    debug_mode: boolean;
    count_error_logs: number;
    count_info_logs: number;
    count_active_orders: number;
    open_positions: number;
    pnl: number;
    pnl_perc: number;
    count_trades: number;
    count_winning_trades: number;
    count_losing_trades: number;
    routes: any[]; // Replace 'any' with the actual type of the items in the 'routes' array if known
}
// ==================== Candle Tab ====================
interface CandleTabs {
    [id: number]: CandleTab;
}
interface CandleTab {
    id: number;
    name: string;
    form: CandleTabForm;
    results: CandleTabResults;
}

interface CandleTabForm {
    start_date: string;
    exchange: string;
    symbol: string;
    debug_mode?: boolean;
}
interface CandleTabResults {
    showResults: boolean;
    executing: boolean;
    progressbar: {
        current: number;
        estimated_remaining_seconds: number;
    };
    metrics: any[]; // Replace 'any' with the actual type of the items in the 'metrics' array if known
    infoLogs: string;
    exception: {
        error: string;
        traceback: string;
    };
    alert: {
        message: string;
        type: string;
    };
}

interface TabCandles {
    start_date: string,
    exchange: string,
    symbol: string,
}

// ==================== Optimization Tab ====================
interface OptimizationTabs {
    [id: number]: OptimizationTab;
}

interface OptimizationResults {
    showResults: boolean;
    executing: boolean;
    logsModal: boolean;
    progressbar: {
        current: number;
        estimated_remaining_seconds: number;
    };
    routes_info: any[];
    best_candidates: any[];
    metrics: any[];
    generalInfo: (string | number)[][];
    infoLogs: string;
    info: (string | number)[][];
    exception: {
        error: string;
        traceback: string;
    };
    alert: {
        message: string;
        type: string;
    };
}


interface OptimizationForm {
    start_date: string;
    finish_date: string;
    debug_mode: boolean;
    export_csv: boolean;
    export_json: boolean;
    routes: any[];
    extra_routes: any[];
    optimal_total: number;
    // add this because of the error
    symbol?: null
}

interface OptimizationTab {
    id: number;
    name: string;
    form: OptimizationForm;
    results: OptimizationResults;
}

interface bestCandidatesEvent {
    rank: number;
    dna: string;
    fitness: number;
    training_win_rate: number;
    training_total_trades: number;
    training_pnl: number;
    testing_win_rate: number;
    testing_total_trades: number;
    testing_pnl: number;
}

interface multiplesTablesValue {
    value: string | number;
    style: string;
    tag?: string;
}

interface GeneralInfoEvent {
    started_at: string,
    index: number,
    average_execution_seconds: number,
    trading_route: string,
    population_size?: number,
    iterations?: number,
    solution_length?: number,
}

// ==================== Backtest Tab ====================
interface BacktestResults {
    showResults: boolean;
    executing: boolean;
    logsModal: boolean;
    progressbar: {
        current: number;
        estimated_remaining_seconds: number;
    };
    routes_info: any[];
    metrics: any[];
    hyperparameters: any[];
    generalInfo: Record<string, unknown>;
    infoLogs: string;
    exception: {
        error: string;
        traceback: string;
    };
    charts: {
        equity_curve: any[];
    };
    alert: {
        message: string;
        type: string;
    };
    info?: (string | number)[][]
}

interface BacktestForm {
    start_date: string;
    finish_date: string;
    debug_mode: boolean;
    export_chart: boolean;
    export_tradingview: boolean;
    export_full_reports: boolean;
    export_csv: boolean;
    export_json: boolean;
    routes: any[];
    extra_routes: any[];
    symbol?: string;
}

interface BacktestTab {
    id: number;
    name: string;
    form: BacktestForm;
    results: BacktestResults;
}

interface BacktestTabs {
    [id: number]: BacktestTab;
}