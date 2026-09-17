# 📊 DataLens — Interactive Data Analysis Platform

**DataLens** is a full-stack web application that makes data analysis easier by turning raw datasets into an interactive dashboard.

Upload your dataset, explore its structure and quality, generate visualizations, discover correlations, get automatic insights, apply filters, and export your results — all from one platform.

🔗 **Live Demo:** https://data-analysis-platform-lake.vercel.app/

💻 **GitHub:** https://github.com/dakshit157/data-analysis-platform

---

## ✨ Features

### 📂 Dataset Upload

- Upload **CSV, Excel, and JSON** files
- Maximum file size: **20 MB**
- Automatic dataset validation
- Automatic schema and data type detection
- Dataset preview

### 📋 Dataset Overview

View important information about your dataset:

- Number of rows
- Number of columns
- Missing values
- Duplicate rows
- Column data types
- Dataset preview

### 🧹 Data Quality Analysis

Analyze the quality of your data with:

- Missing value analysis
- Missing value percentages
- Data type distribution
- Duplicate detection
- IQR-based outlier detection

### 📈 Automatic Data Analysis

DataLens automatically generates visualizations based on the dataset:

- Histograms
- Bar charts
- Line charts
- Time-series visualizations
- Distribution analysis

### 📊 Interactive Visualizations

Create your own charts using:

- Bar Chart
- Line Chart
- Scatter Plot
- Pie Chart
- Histogram
- Box Plot

Choose columns and aggregation options to customize your visualizations.

### 🔗 Correlation Analysis

Explore relationships between numerical columns using:

- Correlation matrix
- Heatmap visualization
- Strongest positive correlations
- Strongest negative correlations

### 💡 Automatic Insights

DataLens generates **18+ data-driven insights** based on the uploaded dataset.

Insights can highlight:

- Important patterns
- Distributions
- Missing data
- Outliers
- Correlations
- High/low values
- Category-level observations

### 🎛️ Dynamic Filters

Filter your dataset interactively using column-specific operators.

Supported filters adapt according to the selected column's data type.

### 📥 Export Results

Export your analysis results as:

- Filtered CSV
- Summary JSON
- Chart screenshots

### 🌙 User Interface

- Dark mode
- Light mode
- Responsive dashboard
- Drag-and-drop upload
- Interactive charts
- Clean data analysis interface

---

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Axios
- React Hot Toast

### Backend

- Python
- FastAPI
- Pandas
- NumPy
- SciPy

### Deployment

- Frontend → Vercel
- Backend → Render

---

## 📁 Project Structure

```text
data-analysis-platform/
│
├── backend/
│   ├── data/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
