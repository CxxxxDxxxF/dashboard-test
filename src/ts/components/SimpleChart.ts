/**
 * Simple Chart Component
 * A reliable, lightweight chart implementation using Canvas API
 */

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
    }[];
}

export class SimpleChart {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private data: ChartData;
    private width: number = 600;
    private height: number = 300;
    private padding: number = 40;
    private barWidth: number = 60;
    private barSpacing: number = 40;

    constructor(canvasId: string, data: ChartData) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.data = data;
        
        this.resize();
        this.render();
    }

    private resize(): void {
        const container = this.canvas.parentElement;
        if (container) {
            // Make chart responsive and fill container width
            this.width = container.clientWidth;
            this.height = container.clientHeight || 300;
            
            // Ensure minimum width for readability
            if (this.width < 400) {
                this.width = 400;
            }
        } else {
            this.width = 600;
            this.height = 300;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Get the 2D context
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    public update(newData: ChartData): void {
        this.data = newData;
        this.render();
    }

    private render(): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (!this.data.datasets[0] || this.data.datasets[0].data.length === 0) {
            this.renderNoData();
            return;
        }

        // Check if this is a stacked bar chart (multiple datasets)
        const isStacked = this.data.datasets.length > 1;
        
        if (isStacked) {
            this.renderStackedBars();
        } else {
            this.renderSingleBars();
        }
    }

    private renderStackedBars(): void {
        const chartWidth = this.width - (this.padding * 2);
        const topPadding = 100; // Increased top padding for labels and legend
        const chartHeight = this.height - (this.padding * 2) - topPadding;
        const numMetrics = this.data.labels.length;
        
        // Calculate bar dimensions for stacked bars - wider bars for better visual impact
        const availableWidth = chartWidth - (numMetrics - 1) * 60; // More spacing between bars
        const barWidth = Math.max(availableWidth / numMetrics, 100); // Minimum 100px width, wider bars
        const barSpacing = 60; // Increased spacing between metric groups

        // Calculate total values for each metric (for scaling)
        const totalValues: number[] = [];
        for (let i = 0; i < numMetrics; i++) {
            let total = 0;
            this.data.datasets.forEach(dataset => {
                if (dataset && dataset.data && Array.isArray(dataset.data) && i < dataset.data.length) {
                    const value = dataset.data[i];
                    if (typeof value === 'number' && !isNaN(value)) {
                        total += value;
                    }
                }
            });
            totalValues.push(total);
        }

        const maxTotal = Math.max(...totalValues);

        // Draw background
        this.drawBackground();

        // Draw stacked bars
        this.data.labels.forEach((label, metricIndex) => {
            const barX = this.padding + (metricIndex * (barWidth + barSpacing));
            let currentY = this.height - this.padding - topPadding; // Start with top padding
            let totalValue = 0;

            // Draw each dataset as a stacked segment - REVERSE ORDER to match legend
            // This ensures Instagram (first in legend) appears on top, Facebook (second) on bottom
            for (let datasetIndex = this.data.datasets.length - 1; datasetIndex >= 0; datasetIndex--) {
                const dataset = this.data.datasets[datasetIndex];
                if (!dataset || !dataset.data) continue;
                
                const value = dataset.data[metricIndex];
                if (value === undefined || value === 0) continue;

                const segmentHeight = (value / maxTotal) * chartHeight * 0.8;
                const segmentY = currentY - segmentHeight;

                // Create gradient for segment
                const gradient = this.ctx.createLinearGradient(0, segmentY, 0, currentY);
                const color = dataset.backgroundColor[0] || '#3B82F6';
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, color + 'CC');

                // Draw rounded rectangle segment
                this.ctx.save();
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                
                // Different rounding based on position in stack
                const isTopSegment = datasetIndex === this.data.datasets.length - 1; // First in reverse loop
                const isBottomSegment = datasetIndex === 0; // Last in reverse loop
                
                if (isTopSegment) {
                    // Top segment - round top corners only
                    this.ctx.moveTo(barX + 8, segmentY);
                    this.ctx.lineTo(barX + barWidth - 8, segmentY);
                    this.ctx.quadraticCurveTo(barX + barWidth, segmentY, barX + barWidth, segmentY + 8);
                    this.ctx.lineTo(barX + barWidth, currentY);
                    this.ctx.lineTo(barX, currentY);
                    this.ctx.lineTo(barX, segmentY + 8);
                    this.ctx.quadraticCurveTo(barX, segmentY, barX + 8, segmentY);
                } else if (isBottomSegment) {
                    // Bottom segment - round bottom corners only
                    this.ctx.moveTo(barX, segmentY);
                    this.ctx.lineTo(barX + barWidth, segmentY);
                    this.ctx.lineTo(barX + barWidth, currentY - 8);
                    this.ctx.quadraticCurveTo(barX + barWidth, currentY, barX + barWidth - 8, currentY);
                    this.ctx.lineTo(barX + 8, currentY);
                    this.ctx.quadraticCurveTo(barX, currentY, barX, currentY - 8);
                    this.ctx.lineTo(barX, segmentY);
                } else {
                    // Middle segment - no rounding (seamless connection)
                    this.ctx.rect(barX, segmentY, barWidth, segmentHeight);
                }
                
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();

                // Draw border
                this.ctx.strokeStyle = dataset.borderColor[0] || '#1E40AF';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();

                currentY = segmentY;
                totalValue += value;
            }

            // Draw total value with increased padding above the bar stack
            this.ctx.fillStyle = '#374151';
            this.ctx.font = 'bold 16px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(totalValue.toLocaleString(), barX + barWidth / 2, currentY - 35); // Increased from -25 to -35

            // Draw metric label
            this.ctx.fillStyle = '#6B7280';
            this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, barX + barWidth / 2, this.height - 15);
        });

        // Draw legend
        this.drawLegend();
    }

    private renderSingleBars(): void {
        const dataset = this.data.datasets[0];
        if (!dataset || !dataset.data) return;
        
        const maxValue = Math.max(...dataset.data);
        const chartWidth = this.width - (this.padding * 2);
        const chartHeight = this.height - (this.padding * 2);
        const barAreaWidth = chartWidth - (this.barSpacing * (dataset.data.length - 1));
        this.barWidth = barAreaWidth / dataset.data.length;

        // Draw background
        this.drawBackground();

        // Draw bars
        dataset.data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight * 0.8;
            const x = this.padding + (index * (this.barWidth + this.barSpacing));
            const y = this.height - this.padding - barHeight;

            // Create gradient for bar
            const gradient = this.ctx.createLinearGradient(0, y, 0, y + barHeight);
            const color = dataset.backgroundColor[index] || '#3B82F6';
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color + 'CC');

            // Draw rounded rectangle bar
            this.ctx.save();
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8, y);
            this.ctx.lineTo(x + this.barWidth - 8, y);
            this.ctx.quadraticCurveTo(x + this.barWidth, y, x + this.barWidth, y + 8);
            this.ctx.lineTo(x + this.barWidth, y + barHeight - 8);
            this.ctx.quadraticCurveTo(x + this.barWidth, y + barHeight, x + this.barWidth - 8, y + barHeight);
            this.ctx.lineTo(x + 8, y + barHeight);
            this.ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - 8);
            this.ctx.lineTo(x, y + 8);
            this.ctx.quadraticCurveTo(x, y, x + 8, y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();

            // Draw border
            this.ctx.strokeStyle = dataset.borderColor[index] || '#1E40AF';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Draw value
            this.ctx.fillStyle = '#374151';
            this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toLocaleString(), x + this.barWidth / 2, y - 10);

            // Draw label
            this.ctx.fillStyle = '#6B7280';
            this.ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            this.ctx.fillText(this.data.labels[index] || `Data ${index + 1}`, x + this.barWidth / 2, this.height - 15);
        });

        // Draw title
        this.ctx.fillStyle = '#111827';
        this.ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(dataset.label, this.width / 2, 25);
    }

    private drawLegend(): void {
        // Position legend at the top, above the chart
        const legendY = 20;
        const legendSpacing = 140;
        const legendStartX = this.padding;
        
        this.data.datasets.forEach((dataset, index) => {
            const legendX = legendStartX + (index * legendSpacing);
            
            // Draw legend color box
            this.ctx.fillStyle = dataset.backgroundColor[0] || '#3B82F6';
            this.ctx.fillRect(legendX, legendY, 16, 16);
            
            // Draw legend text
            this.ctx.fillStyle = '#374151';
            this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(dataset.label, legendX + 24, legendY + 12);
        });
    }

    private drawBackground(): void {
        // Draw grid lines
        this.ctx.strokeStyle = '#E5E7EB';
        this.ctx.lineWidth = 1;
        
        const chartHeight = this.height - (this.padding * 2);
        const gridLines = 5;
        
        for (let i = 0; i <= gridLines; i++) {
            const y = this.padding + (i * chartHeight / gridLines);
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(this.width - this.padding, y);
            this.ctx.stroke();
        }
    }

    private renderNoData(): void {
        this.ctx.fillStyle = '#9CA3AF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('No data available', this.width / 2, this.height / 2);
    }

    public destroy(): void {
        // Clean up if needed
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
} 