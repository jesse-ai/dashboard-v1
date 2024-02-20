interface BacktestResults {
    showResults: boolean;
    executing: boolean;
    logsModal: boolean;
    progressbar: ProgressBar;
    routes_info: RouteInfo[][];
    metrics: ArrayItems;
    hyperparameters: ArrayItems;
    generalInfo: BacktestGeneralInfo;
    infoLogs: string;
    exception: Exception;
    charts: {
        equity_curve: EquityCurve[];
    };
    alert: Alert;
    info: ArrayItems
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
    routes: Route[];
    extra_routes: ExtraRoute[];
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

interface BacktestGeneralInfo {
    debug_mode?: boolean;
    session_id?: string;
}