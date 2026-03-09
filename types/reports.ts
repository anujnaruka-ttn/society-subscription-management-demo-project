export interface ReportType {
    id: string;
    reportType: "pdf" | "csv";
    reportDate: string;
    reportPeriod: "monthly" | "yearly"
}