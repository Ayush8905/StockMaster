# StockMaster - Inventory Management System

A comprehensive inventory management system built with Spring Boot and MongoDB.

## Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.0
- **Language**: Java 21
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with BCrypt
- **Build Tool**: Maven

## Features

### Completed Modules (78%)

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (ADMIN, USER)
   - Secure password hashing with BCrypt

2. **Product Management**
   - Create, read, update, delete products
   - SKU-based tracking
   - Category management
   - Reorder level alerts
   - Soft delete functionality

3. **Warehouse Management**
   - Multiple warehouse support
   - Location tracking
   - Active/inactive status

4. **Stock Management**
   - Real-time stock tracking
   - Multi-warehouse inventory
   - Stock adjustments
   - Low stock detection
   - Total stock calculations

5. **Dashboard & Analytics**
   - KPI metrics
   - Low stock alerts
   - Category breakdown
   - Warehouse statistics
   - Stock value analysis

6. **Receipts (Incoming Stock)**
   - Draft and validated workflow
   - Supplier tracking
   - Auto-generated receipt numbers
   - Automatic stock increment on validation
   - Multi-item receipts

7. **Deliveries (Outgoing Stock)**
   - Draft and validated workflow
   - Customer tracking
   - Auto-generated delivery numbers
   - Automatic stock decrement on validation
   - Insufficient stock protection

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Products (9 endpoints)
- `GET /api/products` - Get all products
- `GET /api/products/active` - Get active products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Soft delete product
- `GET /api/products/search` - Search products
- `GET /api/products/category/{category}` - Filter by category
- `GET /api/products/sku/{sku}` - Get product by SKU

### Warehouses (6 endpoints)
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/active` - Get active warehouses
- `GET /api/warehouses/{id}` - Get warehouse by ID
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Deactivate warehouse

### Stock (7 endpoints)
- `GET /api/stock` - Get all stock
- `GET /api/stock/warehouse/{id}` - Get stock by warehouse
- `GET /api/stock/product/{id}` - Get stock by product
- `GET /api/stock/product/{id}/total` - Get total stock for product
- `GET /api/stock/low` - Get low stock items
- `POST /api/stock` - Create/update stock
- `PUT /api/stock/adjust` - Adjust stock quantity

### Dashboard (2 endpoints)
- `GET /api/dashboard` - Get complete dashboard data
- `GET /api/dashboard/stock-value` - Get stock value analysis

### Receipts (7 endpoints)
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/status/{status}` - Filter by status
- `GET /api/receipts/warehouse/{id}` - Filter by warehouse
- `GET /api/receipts/{id}` - Get receipt by ID
- `POST /api/receipts` - Create draft receipt
- `PUT /api/receipts/{id}/validate` - Validate and update stock
- `DELETE /api/receipts/{id}` - Delete draft receipt

### Deliveries (7 endpoints)
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/status/{status}` - Filter by status
- `GET /api/deliveries/warehouse/{id}` - Filter by warehouse
- `GET /api/deliveries/{id}` - Get delivery by ID
- `POST /api/deliveries` - Create draft delivery
- `PUT /api/deliveries/{id}/validate` - Validate and decrease stock
- `DELETE /api/deliveries/{id}` - Delete draft delivery

## Project Structure

```
inventory-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/StockMaster/inventory_backend/
│   │   │       ├── config/           # Security configuration
│   │   │       ├── controllers/      # REST controllers
│   │   │       ├── dto/              # Data Transfer Objects
│   │   │       ├── models/           # MongoDB entities
│   │   │       ├── repositories/     # MongoDB repositories
│   │   │       ├── security/         # JWT & Auth filters
│   │   │       └── services/         # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- MongoDB Atlas account (or local MongoDB)

### Configuration

1. Update `application.properties` with your MongoDB connection:
```properties
spring.data.mongodb.uri=your-mongodb-connection-string
spring.data.mongodb.database=stockmaster
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/Ayush8905/StockMaster.git
cd StockMaster/inventory-backend
```

2. Build the project:
```bash
mvnw clean install
```

3. Run the application:
```bash
mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

## Testing

### Sample Test Flow

1. Register a user:
```bash
POST http://localhost:8080/api/auth/register
{
  "email": "admin@stockmaster.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

2. Login to get JWT token:
```bash
POST http://localhost:8080/api/auth/login
{
  "email": "admin@stockmaster.com",
  "password": "admin123"
}
```

3. Use the token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Collections

- `users` - User accounts and authentication
- `products` - Product catalog
- `warehouses` - Warehouse locations
- `stock` - Product-warehouse stock levels
- `receipts` - Incoming stock records
- `deliveries` - Outgoing stock records

## Security

- All endpoints (except `/api/auth/**`) require JWT authentication
- Passwords are hashed using BCrypt
- JWT tokens expire after 24 hours
- CORS enabled for frontend integration

## Current Statistics

- **46+ REST API Endpoints**
- **42+ Java Files**
- **6 MongoDB Collections**
- **7 Completed Modules**
- **Production Ready Backend**

## Future Enhancements

- Internal Transfers (warehouse-to-warehouse)
- Stock Ledger/Audit Trail
- Next.js Frontend
- API Documentation (Swagger)
- Deployment Scripts

## Author

Ayush - [GitHub](https://github.com/Ayush8905)

## License

This project is built for educational purposes.
