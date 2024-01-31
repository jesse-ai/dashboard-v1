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
        data: {
            data: Settings;
        }
    }
}