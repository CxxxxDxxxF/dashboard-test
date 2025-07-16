#!/usr/bin/env python3
"""
KMMLU-Pro Demo Launcher
A simple launcher script to run different parts of the demo
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def print_banner():
    """Print the demo banner"""
    print("="*60)
    print("🚀 KMMLU-Pro Enhanced Dataset Demo Launcher")
    print("="*60)
    print()

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = ['datasets', 'transformers', 'torch', 'matplotlib', 'pandas', 'numpy']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print()
        print("📦 Install missing packages with:")
        print(f"   pip install {' '.join(missing_packages)}")
        print()
        return False
    
    print("✅ All required dependencies are installed!")
    print()
    return True

def run_complete_demo():
    """Run the complete demo"""
    print("🚀 Running complete KMMLU-Pro demo...")
    print()
    
    try:
        # Import and run the main demo
        from demo_enhanced import main
        main()
        
        print("\n" + "="*60)
        print("🎉 Demo completed successfully!")
        print("="*60)
        
        # Check for generated files
        generated_files = [
            "dataset_analysis.md",
            "model_comparison_report.md", 
            "model_performance_comparison.png",
            "kmmlu_demo_interface.html"
        ]
        
        print("\n📁 Generated files:")
        for file in generated_files:
            if os.path.exists(file):
                print(f"   ✅ {file}")
            else:
                print(f"   ❌ {file} (not found)")
        
        # Offer to open web interface
        if os.path.exists("kmmlu_demo_interface.html"):
            print("\n🌐 Would you like to open the web interface? (y/n): ", end="")
            response = input().lower().strip()
            if response in ['y', 'yes']:
                webbrowser.open('file://' + os.path.abspath("kmmlu_demo_interface.html"))
                print("✅ Web interface opened in your browser!")
        
    except Exception as e:
        print(f"❌ Error running demo: {e}")
        import traceback
        traceback.print_exc()

def run_individual_step(step_number):
    """Run a specific step of the demo"""
    print(f"🎯 Running step {step_number}...")
    print()
    
    try:
        from demo_enhanced import (
            step1_load_dataset, step2_inspect_dataset, step3_filter_data,
            step4_export_data, step5_cli_interaction, step6_visualize_data,
            step7_evaluate_models, step8_integrate_models, step9_advanced_features,
            step10_advanced_model_comparison
        )
        
        steps = {
            1: step1_load_dataset,
            2: step2_inspect_dataset,
            3: step3_filter_data,
            4: step4_export_data,
            5: step5_cli_interaction,
            6: step6_visualize_data,
            7: step7_evaluate_models,
            8: step8_integrate_models,
            9: step9_advanced_features,
            10: step10_advanced_model_comparison
        }
        
        if step_number in steps:
            steps[step_number]()
            print(f"\n✅ Step {step_number} completed successfully!")
        else:
            print(f"❌ Invalid step number: {step_number}")
            
    except Exception as e:
        print(f"❌ Error running step {step_number}: {e}")
        import traceback
        traceback.print_exc()

def show_web_interface():
    """Open the web interface"""
    if os.path.exists("kmmlu_demo_interface.html"):
        print("🌐 Opening web interface...")
        webbrowser.open('file://' + os.path.abspath("kmmlu_demo_interface.html"))
        print("✅ Web interface opened in your browser!")
    else:
        print("❌ Web interface file not found. Run the demo first to generate it.")

def show_help():
    """Show help information"""
    print("📖 KMMLU-Pro Demo Help")
    print("="*40)
    print()
    print("Available options:")
    print("  1-10  - Run individual demo step")
    print("  c     - Run complete demo")
    print("  w     - Open web interface")
    print("  h     - Show this help")
    print("  q     - Quit")
    print()
    print("Demo steps:")
    print("  1. Dataset Loading")
    print("  2. Data Inspection") 
    print("  3. Data Filtering")
    print("  4. Data Export")
    print("  5. CLI Interaction")
    print("  6. Data Visualization")
    print("  7. Model Evaluation")
    print("  8. Model Integration")
    print("  9. Advanced Features")
    print("  10. Model Comparison")
    print()

def main_menu():
    """Main menu loop"""
    while True:
        print("🎯 What would you like to do?")
        print("  [1-10] Run individual step")
        print("  [c]    Run complete demo")
        print("  [w]    Open web interface")
        print("  [h]    Help")
        print("  [q]    Quit")
        print()
        print("Enter your choice: ", end="")
        
        choice = input().lower().strip()
        print()
        
        if choice == 'q':
            print("👋 Goodbye!")
            break
        elif choice == 'h':
            show_help()
        elif choice == 'c':
            run_complete_demo()
        elif choice == 'w':
            show_web_interface()
        elif choice.isdigit() and 1 <= int(choice) <= 10:
            run_individual_step(int(choice))
        else:
            print("❌ Invalid choice. Please try again.")
        
        print()

def main():
    """Main function"""
    print_banner()
    
    # Check dependencies
    if not check_dependencies():
        print("❌ Please install missing dependencies and try again.")
        return
    
    # Check if demo file exists
    if not os.path.exists("demo_enhanced.py"):
        print("❌ demo_enhanced.py not found in current directory.")
        print("Please make sure you're in the correct directory.")
        return
    
    # Run main menu
    main_menu()

if __name__ == "__main__":
    main() 