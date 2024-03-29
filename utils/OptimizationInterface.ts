interface OptimizationTabs {
    [id: string]: OptimizationTab;
}

interface OptimizationTab {
    id: string;
    form: OptimizationForm;
    results: OptimizationResults;
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
    generalInfo: ArrayItems;
    infoLogs: string;
    info: (string | number)[][];
    exception: Exception;
    alert: Alert;
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

interface OptimizationGeneralInfoEvent {
    started_at: string,
    index: number,
    average_execution_seconds: number,
    trading_route: string,
    population_size?: number,
    iterations?: number,
    solution_length?: number,
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
