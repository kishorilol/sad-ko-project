CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CASHIER') NOT NULL
);

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Cashier (
    cashier_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    shift VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    user_id INT,

    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    selling_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Inventory_Batch (
    batch_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    purchase_date DATE,
    stock INT DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES Product(product_id)
        ON DELETE CASCADE
);

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE Bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    cashier_id INT,
    total_amt DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
        ON DELETE SET NULL,

    FOREIGN KEY (cashier_id) REFERENCES Cashier(cashier_id)
        ON DELETE SET NULL
);

CREATE TABLE Bill_Items (
    bill_item_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (bill_id) REFERENCES Bill(bill_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE INDEX idx_bill_date ON Bill(created_at);
CREATE INDEX idx_bill_cashier ON Bill(cashier_id);
CREATE INDEX idx_product ON Bill_Items(product_id);