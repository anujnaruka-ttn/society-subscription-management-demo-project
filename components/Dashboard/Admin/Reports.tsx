"use client"

import { useState } from 'react'
import {
    Download,
    Eye,
    CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReportsHistoryTable from '@/components/Tables/Admin/ReportsHistory'
import Image from 'next/image'
import reportDemoImage from "@/public/assets/demo-preview-report.png"
import { generateReport, previewReport, getCurrentReportParams } from '@/lib/reportApi';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/stores/store'

const Reports = () => {
    const [format, setFormat] = useState<'pdf' | 'csv'>('pdf')
    const [range, setRange] = useState<'monthly' | 'yearly'>('monthly')
    const [isGenerating, setIsGenerating] = useState(false)
    const dispatch = useDispatch<AppDispatch>()

    const handleGenerateReport = async () => {
        try {
            setIsGenerating(true)
            const currentParams = getCurrentReportParams()
        
            // Just dispatch the action - no token management
            await dispatch(generateReport({
                format,
                range,
                month: currentParams.month,
                year: currentParams.year
            }));
        } catch (error) {
            console.error('Report generation failed:', error)
        } finally {
            setIsGenerating(false)
        }
    }


// Update handlePreviewReport function
const handlePreviewReport = async () => {
    try {
        const currentParams = getCurrentReportParams()
        
        // Use preview function - opens in new tab
        await dispatch(previewReport({
            format,
            range,
            month: currentParams.month,
            year: currentParams.year
        }))
    } catch (error) {
        console.error('Report preview failed:', error)
    }
}

// Update handleDownloadReport function  
const handleDownloadReport = async () => {
    try {
        const currentParams = getCurrentReportParams()
        
        // Use generateReport function - downloads file
        await dispatch(generateReport({
            format,
            range,
            month: currentParams.month,
            year: currentParams.year
        }))
    } catch (error) {
        console.error('Report download failed:', error)
    }
}

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {/* Main Configuration Section */}
            <div className="flex gap-6 w-full h-[50%]">
                {/* Format and Preview Card */}
                <Card className="flex-1 h-full border-border/50 bg-card/30 backdrop-blur-sm flex flex-col p-1.5">
                    <CardContent className="h-full flex flex-col items-center justify-center gap-8 relative rounded-md">
                        <div className="w-full flex items-center justify-between p-3 bg-transparent absolute z-10 left-0 top-0">
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
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-full bg-background/80"
                                onClick={handleDownloadReport}
                                disabled={isGenerating}
                            >
                                <Download className="size-4" />
                            </Button>
                        </div>
                        <Button
                            className="group absolute z-10 h-14 px-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
                            variant="default"
                            onClick={handlePreviewReport}
                            disabled={isGenerating}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Eye className="size-5 transition-transform group-hover:scale-110" />
                                {isGenerating ? 'Generating...' : 'Preview Report'}
                            </span>
                        </Button>
                        <Image src={reportDemoImage} alt="Reports" width={200} height={200}
                            className='w-full h-full absolute top-0 left-0 right-0 bottom-0 z-0 rounded-xl object-cover' />
                    </CardContent>
                </Card>

                {/* Filters and Meta Card */}
                <Card className="flex-1 h-full border-border/50 bg-card/30 backdrop-blur-sm flex flex-col justify-between">
                    <CardContent className="flex flex-col h-full gap-3 pb-1.5 px-3 justify-between">
                        {/* Range Toggle */}
                        <div className='flex flex-col gap-6'>
                            <div className="space-y-3 w-full">
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
                            <div className="space-y-4 w-full">
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
                        </div>

                        {/* Report Generation Button */}
                        <Button
                            variant={"outline"}
                            size={"icon-lg"}
                            className='w-full h-fit px-6 py-3'
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Old Reports List */}
            <Card className="w-full h-[50%] border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
                <CardContent className="p-0 overflow-hidden h-full">
                    <ReportsHistoryTable />
                </CardContent>
            </Card>
        </div>
    )
}

export default Reports;