/**
 * Premium Chart Component
 * A modern, polished chart implementation using Canvas API with gradients, animations, and premium styling
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
    private padding: number = 50; // Increased padding for better spacing
    private barWidth: number = 60;
    private barSpacing: number = 40;
    private animationFrame: number | null = null;
    private animationProgress: number = 0;
    private isAnimating: boolean = false;

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
            this.height = container.clientHeight || 350; // Increased height for better spacing
            
            // Ensure minimum width for readability
            if (this.width < 400) {
                this.width = 400;
            }
        } else {
            this.width = 600;
            this.height = 350;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Get the 2D context with high quality settings
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    public update(newData: ChartData): void {
        this.data = newData;
        this.startAnimation();
    }

    private startAnimation(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationProgress = 0;
        this.isAnimating = true;
        this.animate();
    }

    private animate(): void {
        this.animationProgress += 0.05; // Smooth animation speed
        
        if (this.animationProgress >= 1) {
            this.animationProgress = 1;
            this.isAnimating = false;
        }
        
        this.render();
        
        if (this.isAnimating) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }

    private render(): void {
        // Clear canvas with subtle background
        this.drawBackground();

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
        const topPadding = 120; // Increased top padding for labels and legend
        const chartHeight = this.height - (this.padding * 2) - topPadding;
        const numMetrics = this.data.labels.length;
        
        // Calculate bar dimensions for stacked bars - wider bars for better visual impact
        const availableWidth = chartWidth - (numMetrics - 1) * 80; // More spacing between bars
        const barWidth = Math.max(availableWidth / numMetrics, 120); // Minimum 120px width, wider bars
        const barSpacing = 80; // Increased spacing between metric groups

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

                // Apply animation to segment height
                const animatedValue = value * this.animationProgress;
                const segmentHeight = (animatedValue / maxTotal) * chartHeight * 0.75; // Reduced to 75% for better spacing
                const segmentY = currentY - segmentHeight;

                // Create premium gradient for segment
                const gradient = this.createPremiumGradient(segmentY, currentY, dataset.backgroundColor[0] || '#3B82F6');
                
                // Draw rounded rectangle segment with shadow
                this.drawSegmentWithShadow(barX, segmentY, barWidth, segmentHeight, gradient, datasetIndex === this.data.datasets.length - 1, datasetIndex === 0);

                currentY = segmentY;
                totalValue += animatedValue;
            }

            // Draw total value with increased padding and premium styling
            this.drawTotalValue(barX + barWidth / 2, currentY - 45, totalValue);

            // Draw metric label with premium styling
            this.drawMetricLabel(barX + barWidth / 2, this.height - 20, label);
        });

        // Draw legend with premium styling
        this.drawPremiumLegend();
    }

    private createPremiumGradient(startY: number, endY: number, baseColor: string): CanvasGradient {
        const gradient = this.ctx.createLinearGradient(0, startY, 0, endY);
        
        // Create rich gradient with multiple stops for depth
        gradient.addColorStop(0, this.lightenColor(baseColor, 0.3)); // Light top
        gradient.addColorStop(0.3, baseColor); // Main color
        gradient.addColorStop(0.7, this.darkenColor(baseColor, 0.2)); // Darker middle
        gradient.addColorStop(1, this.darkenColor(baseColor, 0.4)); // Darkest bottom
        
        return gradient;
    }

    private drawSegmentWithShadow(x: number, y: number, width: number, height: number, gradient: CanvasGradient, isTopSegment: boolean, isBottomSegment: boolean): void {
        // Draw shadow first
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 4;
        
        // Draw the segment
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        const radius = 12; // Increased radius for modern look
        
        if (isTopSegment) {
            // Top segment - round top corners only
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x, y + height);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
        } else if (isBottomSegment) {
            // Bottom segment - round bottom corners only
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.ctx.lineTo(x, y);
        } else {
            // Middle segment - no rounding (seamless connection)
            this.ctx.rect(x, y, width, height);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // Draw subtle border
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }

    private drawTotalValue(x: number, y: number, value: number): void {
        // Draw background circle for value
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        
        // Draw circle background
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();

        // Draw value text
        this.ctx.save();
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(value.toLocaleString(), x, y);
        this.ctx.restore();
    }

    private drawMetricLabel(x: number, y: number, label: string): void {
        this.ctx.save();
        this.ctx.fillStyle = '#6B7280';
        this.ctx.font = '600 14px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(label, x, y);
        this.ctx.restore();
    }

    private drawPremiumLegend(): void {
        // Position legend at the top, above the chart with premium styling
        const legendY = 30;
        const legendSpacing = 160; // Increased spacing
        const legendStartX = this.padding;
        
        this.data.datasets.forEach((dataset, index) => {
            const legendX = legendStartX + (index * legendSpacing);
            
            // Draw legend background with shadow
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 2;
            
            // Draw rounded rectangle background
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.beginPath();
            this.drawRoundedRect(legendX - 8, legendY - 8, 140, 32, 8);
            this.ctx.fill();
            this.ctx.restore();
            
            // Draw legend color indicator with gradient
            const gradient = this.createPremiumGradient(legendY, legendY + 16, dataset.backgroundColor[0] || '#3B82F6');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(legendX, legendY, 16, 16);
            
            // Draw legend text
            this.ctx.save();
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '600 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(dataset.label, legendX + 24, legendY + 8);
            this.ctx.restore();
        });
    }

    private renderSingleBars(): void {
        const dataset = this.data.datasets[0];
        if (!dataset || !dataset.data) return;
        
        const maxValue = Math.max(...dataset.data);
        const chartWidth = this.width - (this.padding * 2);
        const chartHeight = this.height - (this.padding * 2);
        const barAreaWidth = chartWidth - (this.barSpacing * (dataset.data.length - 1));
        this.barWidth = barAreaWidth / dataset.data.length;

        // Draw bars
        dataset.data.forEach((value, index) => {
            const animatedValue = value * this.animationProgress;
            const barHeight = (animatedValue / maxValue) * chartHeight * 0.75;
            const x = this.padding + (index * (this.barWidth + this.barSpacing));
            const y = this.height - this.padding - barHeight;

            // Create premium gradient for bar
            const gradient = this.createPremiumGradient(y, y + barHeight, dataset.backgroundColor[index] || '#3B82F6');

            // Draw rounded rectangle bar with shadow
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 4;
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.drawRoundedRect(x, y, this.barWidth, barHeight, 12);
            this.ctx.fill();
            this.ctx.restore();

            // Draw value with premium styling
            this.drawTotalValue(x + this.barWidth / 2, y - 20, animatedValue);

            // Draw label with premium styling
            this.drawMetricLabel(x + this.barWidth / 2, this.height - 20, this.data.labels[index] || `Data ${index + 1}`);
        });

        // Draw title with premium styling
        this.ctx.save();
        this.ctx.fillStyle = '#111827';
        this.ctx.font = 'bold 20px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(dataset.label, this.width / 2, 25);
        this.ctx.restore();
    }

    private drawBackground(): void {
        // Create subtle gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw subtle grid lines
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(229, 231, 235, 0.6)';
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
        this.ctx.restore();
    }

    private renderNoData(): void {
        // Draw premium no data message
        this.ctx.save();
        this.ctx.fillStyle = '#9CA3AF';
        this.ctx.font = '16px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('No data available', this.width / 2, this.height / 2);
        this.ctx.restore();
    }

    // Utility function to draw rounded rectangles (browser compatibility)
    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    // Utility functions for color manipulation
    private lightenColor(color: string, amount: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    private darkenColor(color: string, amount: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }

    public destroy(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
} 