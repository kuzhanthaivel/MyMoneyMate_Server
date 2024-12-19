
# MyMoneyMate Server

MyMoneyMate Server is a **Node.js** backend application that provides APIs for managing users, transactions, and financial data. It is designed to handle secure user authentication, transaction tracking, and automatic calculations for balances and collections.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

---

## Features

1. **User Management**:
   - Automatically initializes a default user on first run.
   - User authentication and profile updates.
   - Dynamic total collection calculations for users.

2. **Transaction Handling**:
   - Add, delete, and retrieve transactions for members.
   - Automatically calculates balances and total paid amounts.

3. **Data Retrieval**:
   - Fetch all transactions and members.
   - Retrieve transactions sorted by date.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or above)
- **npm** (Node Package Manager)
- **MongoDB** (local or cloud instance)

---

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/kuzhanthaivel/MyMoneyMate_Server.git
   \`\`\`
2. Navigate to the project directory:
   \`\`\`bash
   cd MyMoneyMate_Server
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string:
     \`\`\`env
     MONGO_URL=your_mongo_connection_string
     \`\`\`

5. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

The server will run on `http://localhost:5001`.

---

## API Endpoints

### **User Management**
| Method | Endpoint         | Description                     |
|--------|-------------------|---------------------------------|
| `GET`  | `/fetch-username` | Fetch the username of a user.   |
| `POST` | `/verify-user`    | Verify user credentials.        |
| `PUT`  | `/edit-profile`   | Edit username and/or password.  |

---

### **Transaction Management**
| Method   | Endpoint                | Description                              |
|----------|--------------------------|------------------------------------------|
| `POST`   | `/create-member`        | Create a new member.                     |
| `POST`   | `/add-transaction`      | Add a transaction for a member.          |
| `DELETE` | `/delete-transaction`   | Delete a specific transaction.           |
| `GET`    | `/get-all-transactions` | Fetch all transactions.                  |
| `GET`    | `/get-all-names`        | Fetch names of all members.              |
| `GET`    | `/all-transactions-date`| Get all transactions sorted by date.     |

---

### **Data Retrieval**
| Method | Endpoint                      | Description                              |
|--------|-------------------------------|------------------------------------------|
| `GET`  | `/api/total-amount/:username` | Fetch total collection amount by user.   |

---

## Database Schema

### 1. **Users**
This collection stores user-related data.

| Field                     | Type     | Description                                  |
|---------------------------|----------|----------------------------------------------|
| `_id`                     | ObjectId | Auto-generated unique identifier.            |
| `username`                | String   | User's unique username.                      |
| `password`                | String   | Encrypted password for authentication.       |
| `TotalAmmountofcollection`| Number   | Total amount collected from transactions.    |

---

### 2. **TransactionData**
This collection stores details about transactions and their associated members.

| Field         | Type     | Description                                  |
|---------------|----------|----------------------------------------------|
| `_id`         | ObjectId | Auto-generated unique identifier.            |
| `name`        | String   | Member name (e.g., group or individual).      |
| `balance`     | Number   | Remaining amount after payments.             |
| `targetAmount`| Number   | Target amount to be achieved.                |
| `paidAmount`  | Number   | Total paid amount by the member.             |
| `transactions`| Array    | List of individual transactions.             |

#### **Transactions Subdocument**

| Field  | Type     | Description                      |
|--------|----------|----------------------------------|
| `date` | Date     | Date of the transaction.         |
| `amount`| Number  | Transaction amount paid.         |

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   \`\`\`bash
   git checkout -b feature-name
   \`\`\`
3. Commit your changes:
   \`\`\`bash
   git commit -m "Add feature description"
   \`\`\`
4. Push your changes:
   \`\`\`bash
   git push origin feature-name
   \`\`\`
5. Create a pull request.

---

For any issues or feature requests, feel free to open an issue or reach out via GitHub!
