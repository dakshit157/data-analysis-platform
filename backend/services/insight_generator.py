import pandas as pd
from scipy.stats import skew

def generate_insights(df: pd.DataFrame, column_types: dict, correlation_matrix: dict) -> list:
    """Generate meaningful insights from dataset."""
    insights = []

    # 1. Missing Values
    missing_counts = df.isnull().sum()
    if missing_counts.sum() > 0:
        most_missing_col = missing_counts.idxmax()
        missing_val = int(missing_counts.max())
        insights.append({
            "category": "Data Quality", "title": "Missing Values",
            "description": f"Column '{most_missing_col}' has the most missing values.",
            "value": missing_val, "severity": "warning"
        })

    # 2. Duplicates
    duplicates = int(df.duplicated().sum())
    if duplicates > 0:
        insights.append({
            "category": "Data Quality", "title": "Duplicate Rows",
            "description": "The dataset contains duplicate rows.",
            "value": duplicates, "severity": "warning"
        })

    # 3. Skewness
    num_cols = column_types.get("numerical", [])
    for col in num_cols:
        valid_data = df[col].dropna()
        if len(valid_data) > 0:
            s = skew(valid_data)
            if s > 1 or s < -1:
                insights.append({
                    "category": "Distribution", "title": f"Skewed Column: {col}",
                    "description": f"The column '{col}' is highly skewed (skewness: {s:.2f}).",
                    "value": float(s), "severity": "info"
                })

    # 4 & 5. Correlations
    if correlation_matrix:
        flat_corrs = []
        for col1, corrs in correlation_matrix.items():
            for col2, val in corrs.items():
                if col1 < col2 and val is not None:
                    flat_corrs.append((col1, col2, val))
        if flat_corrs:
            max_pos = max(flat_corrs, key=lambda x: x[2])
            if max_pos[2] > 0.5:
                insights.append({
                    "category": "Correlation", "title": "Strong Positive Correlation",
                    "description": f"'{max_pos[0]}' and '{max_pos[1]}' are strongly positively correlated.",
                    "value": float(max_pos[2]), "severity": "info"
                })
            min_neg = min(flat_corrs, key=lambda x: x[2])
            if min_neg[2] < -0.5:
                insights.append({
                    "category": "Correlation", "title": "Strong Negative Correlation",
                    "description": f"'{min_neg[0]}' and '{min_neg[1]}' are strongly negatively correlated.",
                    "value": float(min_neg[2]), "severity": "info"
                })

    # 6. Categorical mode
    cat_cols = column_types.get("categorical", [])
    for col in cat_cols:
        valid_data = df[col].dropna()
        if len(valid_data) > 0:
            mode_val = valid_data.mode()[0]
            pct = (valid_data == mode_val).sum() / len(valid_data) * 100
            insights.append({
                "category": "Categorical", "title": f"Most common {col}",
                "description": f"'{mode_val}' is the most common value.",
                "value": f"{pct:.1f}%", "severity": "info"
            })

    # 7. Numerical Range
    for col in num_cols:
        valid_data = df[col].dropna()
        if len(valid_data) > 0:
            insights.append({
                "category": "Range", "title": f"{col} Range",
                "description": f"Values range from {valid_data.min()} to {valid_data.max()}.",
                "value": f"{valid_data.max() - valid_data.min():.2f} span", "severity": "info"
            })

    # 8. Outliers
    outlier_cols = []
    for col in num_cols:
        valid_data = df[col].dropna()
        if len(valid_data) > 0:
            q1 = valid_data.quantile(0.25)
            q3 = valid_data.quantile(0.75)
            iqr = q3 - q1
            outliers = ((valid_data < q1 - 1.5 * iqr) | (valid_data > q3 + 1.5 * iqr)).sum()
            if outliers > 0:
                outlier_cols.append((col, int(outliers)))
    if outlier_cols:
        most_outliers = max(outlier_cols, key=lambda x: x[1])
        insights.append({
            "category": "Data Quality", "title": "Outliers Detected",
            "description": f"Column '{most_outliers[0]}' has the most outliers.",
            "value": most_outliers[1], "severity": "warning"
        })

    # 9. Dataset size
    insights.append({
        "category": "General", "title": "Dataset Size",
        "description": f"Dataset contains {len(df)} rows and {len(df.columns)} columns.",
        "value": len(df), "severity": "info"
    })

    # 10. Revenue by Category
    if "Revenue" in df.columns and "Category" in df.columns:
        valid_rev = df.dropna(subset=["Revenue", "Category"])
        if not valid_rev.empty:
            avg_rev = valid_rev.groupby("Category")["Revenue"].mean()
            best_cat = avg_rev.idxmax()
            insights.append({
                "category": "Business", "title": "Highest Average Revenue",
                "description": f"Category '{best_cat}' has the highest average revenue.",
                "value": float(avg_rev.max()), "severity": "success"
            })

    return insights
