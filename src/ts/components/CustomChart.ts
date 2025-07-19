/**
 * Custom Chart Component
 * A lightweight, beautiful chart implementation without external dependencies
 */

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        colors: string[];
    }[];
}

export interface ChartOptions {
    width?: number;
    height?: number;
    showGrid?: boolean;
    showValues?: boolean;
    animate?: boolean;
    barSpacing?: number;
    borderRadius?: number;
}

export class CustomChart {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private data: ChartData;
    private options: ChartOptions;
    private animationFrame: number | null = null;

    constructor(canvas: HTMLCanvasElement, data: ChartData, options: ChartOptions = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.data = data;
        this.options = {
            width: 600,
            height: 300,
            showGrid: true,
            showValues: true,
            animate: true,
            barSpacing: 40,
            borderRadius: 8,
            ...options
        };
        
        this.init();
    }

    private init() {
        this.resize();
        this.draw();
        
        if (this.options.animate) {
            this.animate();
        }
    }

    private resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    private draw() {
        const { width, height } = this.canvas.getBoundingClientRect();
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw background
        this.drawBackground(width, height);

        // Calculate scales
        const dataset = this.data.datasets[0];
        if (!dataset || !dataset.data.length) return;
        
        const maxValue = Math.max(...dataset.data);
        const scale = chartHeight / (maxValue * 1.2);

        // Draw grid
        if (this.options.showGrid) {
            this.drawGrid(chartWidth, chartHeight, padding, maxValue, scale);
        }

        // Draw bars
        this.drawBars(chartWidth, chartHeight, padding, scale);

        // Draw labels
        this.drawLabels(chartWidth, chartHeight, padding);
    }

    private drawBackground(width: number, height: number) {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
    }

    private drawGrid(chartWidth: number, chartHeight: number, padding: number, maxValue: number, scale: number) {
        this.ctx.strokeStyle = 'rgba(107, 114, 128, 0.1)';
        this.ctx.lineWidth = 1;

        // Horizontal grid lines
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding + (chartHeight / gridLines) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(padding + chartWidth, y);
            this.ctx.stroke();

            // Grid labels
            if (i < gridLines) {
                const value = Math.round((maxValue * (gridLines - i)) / gridLines);
                this.ctx.fillStyle = '#9CA3AF';
                this.ctx.font = '12px Inter, system-ui, sans-serif';
                this.ctx.textAlign = 'right';
                this.ctx.fillText(value.toLocaleString(), padding - 10, y - 5);
            }
        }
    }

    private drawBars(chartWidth: number, chartHeight: number, padding: number, scale: number) {
        const barWidth = (chartWidth - (this.data.labels.length - 1) * this.options.barSpacing!) / this.data.labels.length;
        const dataset = this.data.datasets[0];
        
        if (!dataset) return;

        dataset.data.forEach((value, index) => {
            const x = padding + index * (barWidth + this.options.barSpacing!);
            const barHeight = value * scale;
            const y = padding + chartHeight - barHeight;

            // Create gradient for bar
            const gradient = this.ctx.createLinearGradient(0, y, 0, y + barHeight);
            const color = dataset.colors[index] || '#FF6B6B';
            const colors = color.split(' ');
            gradient.addColorStop(0, colors[0] || '#FF6B6B');
            gradient.addColorStop(1, colors[1] || colors[0] || '#FF8E8E');

            // Draw bar with rounded corners
            this.drawRoundedRect(x, y, barWidth, barHeight, this.options.borderRadius!, gradient);

            // Draw value on top
            if (this.options.showValues) {
                this.ctx.fillStyle = '#1F2937';
                this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 10);
            }
        });
    }

    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number, fillStyle: string | CanvasGradient) {
        this.ctx.save();
        this.ctx.fillStyle = fillStyle;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    private drawLabels(chartWidth: number, chartHeight: number, padding: number) {
        const barWidth = (chartWidth - (this.data.labels.length - 1) * this.options.barSpacing!) / this.data.labels.length;

        this.data.labels.forEach((label, index) => {
            const x = padding + index * (barWidth + this.options.barSpacing!) + barWidth / 2;
            const y = padding + chartHeight + 25;

            this.ctx.fillStyle = '#6B7280';
            this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, y);
        });
    }

    private animate() {
        let progress = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            // Apply animation to data
            const dataset = this.data.datasets[0];
            if (!dataset) return;
            
            const animatedData = dataset.data.map(value => value * easeOutQuart);
            const animatedChartData: ChartData = {
                labels: this.data.labels,
                datasets: [{
                    label: dataset.label,
                    data: animatedData,
                    colors: dataset.colors
                }]
            };

            // Redraw with animated data
            this.drawWithData(animatedChartData);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    private drawWithData(data: ChartData) {
        const originalData = this.data;
        this.data = data;
        this.draw();
        this.data = originalData;
    }

    public update(newData: ChartData) {
        this.data = newData;
        this.draw();
    }

    public destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    public resize() {
        this.resizeCanvas();
        this.draw();
    }
}

// Factory function for easy creation
export function createCustomChart(
    canvasId: string, 
    data: ChartData, 
    options: ChartOptions = {}
): CustomChart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        console.error(`Canvas with id '${canvasId}' not found`);
        return null;
    }
    
    return new CustomChart(canvas, data, options);
} 