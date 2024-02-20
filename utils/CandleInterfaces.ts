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
    progressbar: ProgressBar;
    metrics: any[]; // Replace 'any' with the actual type of the items in the 'metrics' array if known
    infoLogs: string;
    exception: Exception;
    alert: Alert;
}