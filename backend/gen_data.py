import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

def generate():
    os.makedirs(r"d:\Projects\dataanalysis\backend\data", exist_ok=True)
    products = ['Wireless Mouse', 'USB-C Hub', 'Mechanical Keyboard', 'Monitor Stand',
                'Webcam HD', 'Laptop Sleeve', 'Desk Lamp', 'Noise Cancelling Headphones',
                'Portable SSD', 'Ergonomic Chair', 'Standing Desk Mat', 'Cable Management Kit',
                'Blue Light Glasses', 'Wireless Charger', 'Smart Power Strip']
    categories = ['Electronics', 'Accessories', 'Furniture', 'Lighting', 'Storage']
    regions = ['North', 'South', 'East', 'West']

    data = []
    start_date = datetime(2024, 1, 1)
    for i in range(1, 198):
        date = start_date + timedelta(days=random.randint(0, 364))
        product = random.choice(products)
        
        # Categorize logically
        if any(x in product for x in ['Mouse', 'Hub', 'Webcam', 'SSD', 'Headphones']):
            category = 'Electronics'
        elif any(x in product for x in ['Keyboard', 'Sleeve', 'Glasses', 'Kit', 'Charger', 'Strip']):
            category = 'Accessories'
        elif any(x in product for x in ['Chair', 'Mat', 'Stand']):
            category = 'Furniture'
        elif 'Lamp' in product:
            category = 'Lighting'
        else:
            category = random.choice(categories)

        region = random.choice(regions)
        qty = random.randint(1, 15)
        
        # Pricing logic
        if category == 'Electronics': price = round(random.uniform(49.99, 499.99), 2)
        elif category == 'Accessories': price = round(random.uniform(9.99, 99.99), 2)
        elif category == 'Furniture': price = round(random.uniform(99.99, 399.99), 2)
        else: price = round(random.uniform(19.99, 149.99), 2)

        # Higher price -> lower quantity usually
        if price > 200: qty = random.randint(1, 3)

        revenue = round(qty * price, 2)
        age = random.randint(18, 70)
        rating = round(random.uniform(1.0, 5.0), 1)

        data.append([i, date.strftime('%Y-%m-%d'), product, category, region, qty, price, revenue, age, rating])

    df = pd.DataFrame(data, columns=['OrderID', 'Date', 'Product', 'Category', 'Region', 'Quantity', 'UnitPrice', 'Revenue', 'CustomerAge', 'Rating'])

    # Introduce ~5% missing values (empty strings) in CustomerAge, Rating, Region
    for col in ['CustomerAge', 'Rating', 'Region']:
        indices = np.random.choice(df.index, size=10, replace=False)
        df.loc[indices, col] = np.nan

    # Add 3 duplicates to make it 200 rows
    dupes = df.sample(3, random_state=42)
    df = pd.concat([df, dupes], ignore_index=True)

    df.to_csv(r"d:\Projects\dataanalysis\backend\data\sample.csv", index=False)
    print("Generated data/sample.csv")

if __name__ == '__main__':
    generate()
