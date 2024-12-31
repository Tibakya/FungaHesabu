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

## Features

### Dashboard Overview
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
   ```

2. Navigate to the project directory:
   ```bash
   cd FungaHesabu
   ```

3. Install dependencies:
   ```bash
   composer install
   npm install
   ```

4. Configure the `.env` file:
   - Copy the example file:
     ```bash
     cp .env.example .env
     ```
   - Update database credentials and other environment variables in the `.env` file.

5. Generate the application key:
   ```bash
   php artisan key:generate
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve
   npm run dev
   ```

8. Access the application at `http://localhost:8000`.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## Contact
For any inquiries or feedback, feel free to contact the project owner at `your-email@example.com`. 

---

Thank you for using **FungaHesabu**!
#   F u n g a H e s a b u  
 