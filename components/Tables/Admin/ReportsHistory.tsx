import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/stores/store';
import { getReportRecords } from '@/lib/reportApi';
import { useEffect } from 'react';
import { reportColumns } from './Columns/ReportColumns';
import { FadeLoader } from 'react-spinners';
import { CommonTable } from '../Common/CommonTable';
import { useDataTable } from '@/hooks/use-data-table';

export default function ReportsHistoryTable() {
    const dispatch = useDispatch<AppDispatch>();
    const reports = useSelector((state: RootState) => state.reports.reports);
    const loading = useSelector((state: RootState) => state.reports.loading);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                await dispatch(getReportRecords());
            } catch (error) {
                console.error('Failed to fetch report records:', error);
            }
        };

        fetchReports();
    }, [dispatch]);

    const { table, globalFilter, setGlobalFilter } = useDataTable({
        data: reports,
        columns: reportColumns,
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FadeLoader color="var(--primary)"/>
            </div>
        );
    }

    return (
        <CommonTable
            table={table}
            columnsCount={reportColumns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            className="pt-0 pb-1.5 px-3"
        />
    );
}