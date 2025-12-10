-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE PRODUCTS
INSERT INTO
    products (name, price, image)
SELECT *
FROM (
        SELECT 'Nike Air Shoes', 2999.00, 'https://images.unsplash.com/photo-1528701800489-20be3c5b1f5c'
    ) AS tmp
WHERE
    NOT EXISTS (
        SELECT id
        FROM products
        WHERE
            name = 'Nike Air Shoes'
    );

INSERT INTO
    products (name, price, image)
SELECT *
FROM (
        SELECT 'Apple Watch', 15999.00, 'https://images.unsplash.com/photo-1517384966993-943cde4f2f33'
    ) AS tmp
WHERE
    NOT EXISTS (
        SELECT id
        FROM products
        WHERE
            name = 'Apple Watch'
    );

INSERT INTO
    products (name, price, image)
SELECT *
FROM (
        SELECT 'Macbook Pro', 124999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
    ) AS tmp
WHERE
    NOT EXISTS (
        SELECT id
        FROM products
        WHERE
            name = 'Macbook Pro'
    );