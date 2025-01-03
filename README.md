# FungaHesabu

**FungaHesabu** is an advanced Point of Sale (POS) and inventory management system built with **Laravel**, **ReactJS**, and **MySQL**. This system is designed to help retail businesses streamline their operations by providing tools to manage sales, inventory, customers, and detailed reporting. With its modern interface and robust functionality, FungaHesabu ensures efficiency, accuracy, and scalability for businesses of all sizes.

---

## Features

### User Management
- Create and manage user accounts with role-based access.
- Assign specific permissions for secure and organized system access.
- Super Admin role with full access to all system functionalities.

### Dashboard
- Centralized hub for quick insights into business operations.
- Real-time analytics of sales, purchases, and inventory trends.
- Highlights include top-selling products, top customers, and low-stock alerts.
- Displays weekly sales and purchases for better business planning.

### Customers Management
- Add, edit, and delete customer profiles with ease.
- Access detailed customer transaction histories.
- Select customers during POS transactions for a personalized experience.

### Warehouse Management
- Manage multiple warehouses and track stock levels for each.
- Assign products to specific warehouses to ensure accurate inventory tracking.
- Get alerts for low stock in each warehouse.

### Products Management
- Add, edit, and delete product details, including pricing and stock levels.
- Generate unique barcodes for quick scanning and product identification.
- Categorize products into brands and categories for easy navigation.
- Set minimum stock alerts to notify when products need restocking.

### Sales Management
- Process sales transactions and generate invoices automatically.
- Handle sales returns with accurate inventory adjustments.
- View detailed sales records and customer purchase history.

### Purchases Management
- Record and manage stock purchases to replenish inventory.
- Specify the warehouse and products being restocked.
- Handle purchase returns and adjust stock levels accordingly.

### Barcode Printing
- Generate barcodes for all products and print them in bulk or individually.
- Customize barcode labels with different sizes and formats.
- Preview barcodes before printing to ensure accuracy.

### Expense Management
- Track company expenses with detailed records.
- Categorize expenses into predefined categories for better organization.
- View expense summaries and manage budgets effectively.

### Multi-Currency Support
- Add and manage multiple currencies for international transactions.
- Set a default currency for local operations.
- Update exchange rates for accurate currency conversion.

### Reports and Analytics
- Generate detailed reports for sales, purchases, inventory, and expenses.
- Identify top-selling products and top customers.
- Analyze stock movement across warehouses.
- View financial summaries for better decision-making.

### Settings
- Customize application settings such as business name, address, and logo.
- Configure email notifications for transactions and updates.
- Clear cached data for optimized system performance.

---

## Technologies Used
- **Backend**: Laravel (PHP 7.4+)
- **Frontend**: ReactJS, HTML, CSS, and JavaScript
- **Database**: MySQL 5.6+

---

## Dashboard Overview
The dashboard provides a comprehensive view of the business, including weekly sales, top-selling products, and stock alerts.

![Dashboard](screenshots/dashboard.png)

### Product Management
Easily add, edit, and delete products while keeping track of stock levels with automated alerts.

![Product Management](screenshots/product_management.png)

### Sales Transactions
Manage customer checkouts seamlessly with a clean and user-friendly POS interface.

![Sales Transactions](screenshots/sales_transactions.png)

### Reports
Generate insightful reports for sales, purchases, and inventory to make data-driven decisions.

![Reports](screenshots/reports.png)

---

## Installation Guide

### Prerequisites
Ensure your system meets the following requirements:
- Web Server: Apache, Nginx, or similar
- PHP Version: >= 7.4
- MySQL Version: >= 5.6
- PHP Extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/FungaHesabu.git
2. Navigate to the project directory:
   cd FungaHesabu
   cd FungaHesabu
   ```

    cd FungaHesabu
   ```

3. Install dependencies:
    composer install
4. Create a database and import the schema:
    php artisan migrate
5. Set up environment variables in `.env` file:
    cp .env.example .env
    Edit the `.env` file with your database credentials and other necessary settings.
6. Run the application:
    php artisan serve
7. Access the application in your web browser: http://localhost:8000

---

## Contributing
Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---  

# FungaHesabu
