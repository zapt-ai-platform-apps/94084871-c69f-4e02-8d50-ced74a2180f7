# MedStore - Professional Medical Store Application

MedStore is a complete, production-ready Medical Store Application for Web and Mobile, designed to provide a seamless experience for users to purchase medicine online.

## Features

- **User Authentication:** Register/login via email, phone number, and OTP verification
- **Medicine Catalogue:** Browse medicines by categories with detailed information
- **Prescription Upload:** Upload prescriptions for specific medicines
- **Shopping Cart & Checkout:** Complete e-commerce functionality
- **Order Tracking:** Track orders through various status updates
- **Admin Dashboard:** Manage inventory, orders, prescriptions, and more
- **Notifications:** Receive updates for orders and offers
- **Security:** Data encryption and secure login with OTP/2FA

## Tech Stack

- React with Vite for the frontend
- Zustand for state management
- Firebase for authentication, storage, and notifications
- CockroachDB with Drizzle ORM for the database
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Vercel for deployment

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── modules/          # Feature modules
│   ├── auth/         # Authentication functionality
│   ├── cart/         # Shopping cart functionality
│   ├── catalogue/    # Medicine catalogue
│   ├── checkout/     # Checkout process
│   ├── orders/       # Order tracking and history
│   ├── prescriptions/ # Prescription management
│   └── admin/        # Admin dashboard
├── pages/            # Application pages
└── utils/            # Utility functions
```

## License

All rights reserved.