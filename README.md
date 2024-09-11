# E-Commerce Application

Welcome to the E-Commerce Application! This project is designed to provide a seamless online shopping experience, allowing users to browse products, manage their accounts, and interact with the platform efficiently. Below is an overview of the key features and functionalities of this application.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Database ERD](#database-erd)

## Features

- **Admin Management**: 
  - Admins can be added directly from the database or by existing admins, ensuring a secure and manageable admin hierarchy.

- **User Password Management**: 
  - Users have the ability to change their passwords. All passwords are securely hashed and stored in the database for enhanced security.

- **Data Integrity**: 
  - When a category or brand is removed, all associated photos are automatically deleted to maintain a clean database.

- **Audit Trail**: 
  - Every action performed within the application is recorded with a reference to the user ID. This ensures accountability and minimizes the risk of unauthorized changes.

- **Review System**: 
  - Users can add reviews for products, as well as update or delete their reviews as needed, fostering community engagement and feedback.

- **Coupon System**: 
  - Users can apply coupons at checkout, allowing for discounts and special offers, enhancing the shopping experience.

## Database ERD

![ERD Diagram](Screenshot 2024-09-12 at 2.41.30 AM)

## Getting Started

To get started with the E-Commerce Application, follow the instructions below to set up the project on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/e-commerce.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd e-commerce
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables by creating a `.env` file and adding the necessary configurations.

### Usage

Once installed, you can start the application using the following command:

```bash
npm start
```

The application will be running on `http://localhost:3000` (or your specified port).

## API Endpoints

Here are some of the key API endpoints available in this application:

- **User Registration**: `POST /api/users/register`
- **User Login**: `POST /api/users/login`
- **Change Password**: `PUT /api/users/change-password`
- **Add Product**: `POST /api/products`
- **Remove Category**: `DELETE /api/categories/:id`
- **Add Review**: `POST /api/products/:id/reviews`
- **Apply Coupon**: `POST /api/coupons/apply`

Refer to the API documentation for detailed usage and examples.

## Contributing

We welcome contributions to enhance the E-Commerce Application! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

---

Thank you for checking out the E-Commerce Application! We hope you find it useful and informative. If you have any questions or feedback, feel free to reach out!
```

