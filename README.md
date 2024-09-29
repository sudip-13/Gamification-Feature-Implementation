# Gamification Feature Implementation for User Transactions

## Overview
This project implements a points system where users earn points (coins) for each dummy transaction they perform. Users can redeem their points after completing a checkpoint of 5 transactions. The project includes a visually appealing and responsive UI, designed to enhance user experience through gamification.

## Getting Started

1. Clone the repository and unzip the attached file.

2. Navigate to the project directory via the terminal:
    ```bash
    cd server
    yarn install
    yarn dev
    ```


3. In a new terminal, navigate to the frontend directory:
    ```bash
    cd assignment_ragilly_frontend
    yarn
    yarn dev
    ```


4. Open  [http://localhost:3000](http://localhost:3000)  with your browser to see the result. If the page doesn't load properly, try refreshing the browser.


## Live Link

You can also access the live demo of the project at: [https://gamification-feature-implementation.vercel.app/](#)

## Features

### 1. Points System
- Users are awarded points for each transaction.
- The number of points correlates with the transaction amount minimum transaction should be 100.
- For example: ₹1,000 transaction awards 100 points (calculated as `Math.floor(transaction_amount / 10)`) .
- The payment is handled using Razorpay with predefined test credentials.

### 2. Redemption Mechanism
- Users can redeem their points after every 5 completed transactions.
- Points can be converted to cash once the redemption checkpoint is reached.
- Clear progress indicators show the number of transactions left before the next redemption.


## Implementation Details
###  User Interface
- ## **Homepage:**

- **Buttons**: `Make Payment`, `Dashboard`, `Login/Logout`.
- After login, `Make Payment` and `Dashboard` buttons are enabled.

### Make Payment
- On clicking `Make Payment`, a pop-up appears for the transaction amount.
- For transaction amounts > ₹100, users get `Math.floor(transactionamount/10)` points.
- Test payment details:
  - **Success UPI ID**: `success@razorpay`
  - **Failure UPI ID**: `failure@razorpay`
  - **Success Card Details**: 
    - Card Number: `4111 1111 1111 1111`
    - CVV: Any three digits
    - Expiry: Any future date(`MM/YY` format)
    - OTP: 1111


- ## **Dashboard:**

- Displays redeemable points, transaction history and Withdrawable Balance.
- Users can convert redeemable points to cash after every 5th transaction.

- **Navbar**:
  - `Withdrawal` component with `Cash` and `Requests` buttons.

  - Add bank details using `Add Account` button.

  - Users can submit withdrawal requests once the bank details are confirmed.

  - View withdrawal history on clicking `Requests` button.