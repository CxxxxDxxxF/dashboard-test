# 🚀 KMMLU-Pro Enhanced Dataset Demo

A comprehensive demonstration of working with the **KMMLU-Pro** (Korean Multi-Modal Language Understanding) dataset using modern Python tools and techniques.

## 📋 Overview

This demo showcases advanced dataset analysis, visualization, model evaluation, and interactive features for the KMMLU-Pro dataset from Hugging Face. The project demonstrates best practices in data science workflows and provides a complete toolkit for dataset exploration.

## ✨ Features

### 🔧 Core Functionality
- **Dataset Loading**: Seamless integration with Hugging Face datasets
- **Data Inspection**: Comprehensive dataset analysis and statistics
- **Advanced Filtering**: Multi-criteria data filtering and preprocessing
- **Export Capabilities**: Multiple format support (CSV, JSON, Parquet)
- **Interactive CLI**: Command-line interface for dataset exploration

### 📊 Visualization & Analytics
- **Data Visualization**: Charts and graphs for dataset insights
- **Performance Metrics**: Model comparison and benchmarking
- **Statistical Analysis**: Detailed dataset statistics and distributions
- **Interactive Plots**: Dynamic visualizations with matplotlib

### 🤖 Model Integration
- **Model Evaluation**: Dummy model performance testing
- **Hugging Face Integration**: Real model loading and inference
- **Performance Comparison**: Multi-model benchmarking
- **Advanced Reporting**: Comprehensive model analysis reports

### 🌐 Web Interface
- **Modern UI**: Beautiful, responsive web interface
- **Interactive Dashboard**: Real-time dataset statistics
- **Feature Showcase**: Complete demo feature overview
- **Cross-platform**: Works on desktop and mobile devices

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Setup Instructions

1. **Clone or download the demo files**
   ```bash
   # If you have the files locally, navigate to the directory
   cd /path/to/demo/files
   ```

2. **Install required dependencies**
   ```bash
   pip install datasets transformers torch matplotlib pandas numpy
   ```

3. **Optional: Install additional packages for enhanced features**
   ```bash
   pip install plotly seaborn scikit-learn
   ```

## 🚀 Usage

### Quick Start
```bash
python demo_enhanced.py
```

This will run the complete demo with all features automatically.

### Step-by-Step Execution
The demo is organized into 10 comprehensive steps:

1. **Dataset Loading** - Load KMMLU-Pro from Hugging Face
2. **Data Inspection** - Analyze dataset structure and statistics
3. **Data Filtering** - Apply filters and preprocessing
4. **Data Export** - Export to various formats
5. **CLI Interaction** - Interactive command-line exploration
6. **Data Visualization** - Create charts and graphs
7. **Model Evaluation** - Test dummy model performance
8. **Model Integration** - Load real Hugging Face models
9. **Advanced Features** - Additional analysis tools
10. **Model Comparison** - Comprehensive model benchmarking

### Web Interface
After running the demo, open `kmmlu_demo_interface.html` in your web browser to access the interactive web interface.

## 📁 Generated Files

The demo creates several output files:

### Reports
- `dataset_analysis.md` - Comprehensive dataset analysis
- `model_comparison_report.md` - Model performance comparison
- `model_performance_comparison.png` - Performance visualization charts

### Data Exports
- `filtered_easy_questions.csv` - Easy difficulty questions
- `filtered_medium_questions.csv` - Medium difficulty questions
- `filtered_hard_questions.csv` - Hard difficulty questions
- `filtered_science_questions.csv` - Science category questions

### Web Interface
- `kmmlu_demo_interface.html` - Interactive web dashboard

## 🎯 Key Features Explained

### 1. Dataset Loading (`step1_load_dataset`)
- Loads KMMLU-Pro dataset from Hugging Face
- Handles authentication and caching
- Provides dataset overview and basic statistics

### 2. Data Inspection (`step2_inspect_dataset`)
- Analyzes dataset structure and content
- Generates comprehensive statistics
- Identifies data quality issues
- Creates detailed analysis report

### 3. Advanced Filtering (`step3_filter_data`)
- Filters by difficulty level, subject, and other criteria
- Handles missing data and edge cases
- Provides filtered dataset statistics
- Supports multiple filter combinations

### 4. Export Functionality (`step4_export_data`)
- Exports to CSV, JSON, and Parquet formats
- Handles large datasets efficiently
- Provides export progress tracking
- Creates organized file structure

### 5. CLI Interaction (`step5_cli_interaction`)
- Interactive command-line interface
- Real-time dataset exploration
- Dynamic filtering and searching
- User-friendly menu system

### 6. Data Visualization (`step6_visualize_data`)
- Creates various chart types
- Generates performance visualizations
- Saves high-quality images
- Provides interactive plotting options

### 7. Model Evaluation (`step7_evaluate_models`)
- Tests dummy model performance
- Calculates accuracy metrics
- Provides detailed evaluation reports
- Supports multiple evaluation criteria

### 8. Model Integration (`step8_integrate_models`)
- Loads real Hugging Face models
- Performs inference on dataset
- Handles model caching and optimization
- Provides performance benchmarks

### 9. Advanced Features (`step9_advanced_features`)
- Additional analysis tools
- Extended filtering capabilities
- Enhanced visualization options
- Advanced reporting features

### 10. Model Comparison (`step10_advanced_model_comparison`)
- Compares multiple models
- Generates comprehensive reports
- Creates performance charts
- Provides recommendations

## 🔧 Customization

### Adding New Filters
```python
# Example: Add custom filter
def custom_filter(dataset):
    return dataset.filter(lambda x: your_condition(x))

# Use in step3_filter_data
filtered_data = custom_filter(dataset)
```

### Modifying Visualizations
```python
# Example: Custom chart
import matplotlib.pyplot as plt

def custom_chart(data):
    plt.figure(figsize=(10, 6))
    # Your custom plotting code
    plt.savefig('custom_chart.png')
    plt.close()
```

### Extending Model Evaluation
```python
# Example: Add new evaluation metric
def custom_metric(predictions, targets):
    # Your custom metric calculation
    return score

# Use in step7_evaluate_models
score = custom_metric(predictions, targets)
```

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   pip install --upgrade datasets transformers torch
   ```

2. **Memory Issues**
   - Use smaller dataset splits
   - Enable dataset streaming
   - Reduce batch sizes

3. **Authentication Issues**
   ```bash
   huggingface-cli login
   ```

4. **Visualization Errors**
   ```bash
   pip install matplotlib seaborn plotly
   ```

### Performance Optimization

- Use dataset streaming for large datasets
- Enable caching for repeated operations
- Use appropriate batch sizes
- Consider using GPU acceleration for model inference

## 📚 Additional Resources

### Documentation
- [Hugging Face Datasets](https://huggingface.co/docs/datasets/)
- [Transformers Library](https://huggingface.co/docs/transformers/)
- [KMMLU-Pro Dataset](https://huggingface.co/datasets/LGAI-EXAONE/KMMLU-Pro)

### Related Projects
- [Korean Language Models](https://huggingface.co/models?language=ko)
- [Multi-Modal Datasets](https://huggingface.co/datasets?task_categories=multimodal)
- [Language Understanding Benchmarks](https://huggingface.co/datasets?task_categories=question-answering)

## 🤝 Contributing

Feel free to contribute to this demo by:
- Adding new features
- Improving documentation
- Fixing bugs
- Enhancing visualizations
- Adding more model integrations

## 📄 License

This demo is provided as-is for educational and research purposes. Please respect the original dataset licenses and terms of use.

## 🙏 Acknowledgments

- **LGAI-EXAONE** for creating the KMMLU-Pro dataset
- **Hugging Face** for providing the datasets and transformers libraries
- **Open Source Community** for the various Python libraries used

---

**Happy exploring! 🚀**

For questions or issues, please refer to the troubleshooting section or create an issue in the project repository. 