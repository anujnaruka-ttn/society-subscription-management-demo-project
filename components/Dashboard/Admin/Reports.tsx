"use client"

import { useState } from 'react'
import {
    Download,
    Eye,
    CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReportsHistoryTable from '@/components/Tables/Admin/ReportsHistory'

const Reports = () => {
    const [format, setFormat] = useState('pdf')
    const [range, setRange] = useState('monthly')

    const oldReports = [
        {
            filename: "Feb_2026_Collection.pdf",
            date: "Mar 01, 2026",
            type: "Monthly",
            filter: "Paid Only",
            size: "1.2 MB"
        },
        {
            filename: "Jan_2026_Financial.csv",
            date: "Feb 02, 2026",
            type: "Monthly",
            filter: "All Records",
            size: "450 KB"
        },
        {
            filename: "Annual_Audit_2025.pdf",
            date: "Jan 10, 2026",
            type: "Yearly",
            filter: "Standard",
            size: "4.8 MB"
        },
        {
            filename: "Q4_2025_Summary.pdf",
            date: "Jan 05, 2026",
            type: "Yearly",
            filter: "Breakdown",
            size: "2.1 MB"
        }
    ]

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {/* Main Configuration Section */}
            <div className="flex gap-6 w-full h-[40%]">
                {/* Format and Preview Card */}
                <Card className="w-[60%] border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/50">
                        <div className="flex items-center gap-4 bg-muted/50 p-1.5 rounded-xl border border-border/40">
                            <Button
                                variant={format === 'pdf' ? 'default' : 'ghost'}
                                onClick={() => setFormat('pdf')}
                                className={`h-10 px-8 rounded-lg transition-all duration-300 ${format === 'pdf' ? 'shadow-sm' : ''}`}
                            >
                                PDF
                            </Button>
                            <div className="h-6 w-px bg-border/60" />
                            <Button
                                variant={format === 'csv' ? 'default' : 'ghost'}
                                onClick={() => setFormat('csv')}
                                className={`h-10 px-8 rounded-lg transition-all duration-300 ${format === 'csv' ? 'shadow-sm' : ''}`}
                            >
                                CSV
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full border border-border/50 hover:bg-background">
                            <Download className="size-4" />
                        </Button>
                    </div>
                    <CardContent className="flex-1 flex flex-col items-center justify-center py-10 gap-8">
                        <Button
                            className="group relative h-14 px-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
                            variant="default"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Eye className="size-5 transition-transform group-hover:scale-110" />
                                Preview Report
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Filters and Meta Card */}
                <Card className="flex-1 border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full gap-8">
                        {/* Range Toggle */}
                        <div className="space-y-3">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Reporting Period</span>
                            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg border border-border/40">
                                <Button
                                    variant={range === 'monthly' ? 'outline' : 'ghost'}
                                    size="sm"
                                    onClick={() => setRange('monthly')}
                                    className={`w-[50%] h-8 text-xs hover: font-semibold transition-all duration-300 ${range === 'monthly' ? 'bg-background shadow-sm' : ''}`}
                                >
                                    Monthly
                                </Button>
                                <Button
                                    variant={range === 'yearly' ? 'outline' : 'ghost'}
                                    size="sm"
                                    onClick={() => setRange('yearly')}
                                    className={`w-[50%] h-8 text-xs font-semibold transition-all duration-300 ${range === 'yearly' ? 'bg-background shadow-sm' : ''}`}
                                >
                                    Yearly
                                </Button>
                            </div>
                        </div>

                        {/* Content Indicators */}
                        <div className="space-y-4 flex-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Includes Content</span>
                            <div className="space-y-3 px-1">
                                {[
                                    "Total collection summary",
                                    "Pending payments list",
                                    "Payment-mode breakdown"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="size-5 rounded-md border border-primary/30 flex items-center justify-center bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                                            <CheckCircle2 className="size-3.5" />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Old Reports List */}
            <Card className="w-full max-h-[50%] border-border/50 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-hidden max-h-full">
                    <ReportsHistoryTable />
                </CardContent>
            </Card>
        </div>
    )
}

export default Reports;