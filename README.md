# 📊 DataLens — Interactive Data Analysis Platform

> Turn raw CSV data into insights, visualizations, and actionable observations — directly from your browser.

**DataLens** is a full-stack data analysis platform built for exploring CSV datasets without writing analysis code manually. Upload a dataset, inspect its quality, explore visualizations, discover correlations, apply filters, and export your results from one interactive dashboard.

## 🌐 Live Demo

**Frontend:** https://data-analysis-platform-lake.vercel.app

**Backend API:** https://data-analysis-backend-3ca5.onrender.com

**API Docs:** https://data-analysis-backend-3ca5.onrender.com/docs

---

## ✨ What DataLens Can Do

### 📂 Upload & Understand
- Drag-and-drop or click-to-upload CSV files
- Automatic CSV validation
- Automatic column type detection
- Instant dataset preview

### 🔎 Explore Your Data
- Row and column statistics
- Missing-value analysis
- Duplicate detection
- Data-type distribution
- IQR-based outlier detection

### 📈 Visualize
- Automatically generated charts based on column types
- Bar charts
- Line charts
- Scatter plots
- Pie charts
- Histograms
- Box plots
- Custom chart configuration

### 🔗 Find Relationships
- Correlation matrix
- Heatmap visualization
- Strongest positive and negative correlations

### 💡 Discover Insights
- 18+ automatically generated observations
- Insights are calculated from the uploaded dataset
- No fabricated or hardcoded data-driven results

### 🎛️ Filter & Export
- Dynamic filters based on column types
- Numeric range filtering
- Categorical filtering
- Export filtered CSV
- Export analysis summary as JSON
- Export chart screenshots

### 🎨 User Experience
- Dark / Light mode
- Responsive dashboard
- Collapsible sidebar
- Desktop, tablet, and mobile support

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 4, Recharts |
| Backend | Python, FastAPI, Pandas, NumPy, SciPy |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 🏗️ Project Structure

```text
data-analysis-platform/
├── backend/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── data/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md