# Ysrap Etpe - Food Surplus App for Central Asia

A "Too Good To Go" style application designed for the Central Asia market, starting with Kazakhstan Almaty. This app helps reduce food waste by connecting customers with restaurants and cafes that have surplus food at discounted prices.

## 🌟 Features

### Customer App (Mobile)
- **Browse nearby surplus food bags** with location-based filtering
- **View mystery bags** with original and discounted prices
- **Reserve and pay** for food bags
- **Real-time pickup codes** for order verification
- **Category filtering** (Bakery, Restaurant, Cafe, Grocery)
- **Beautiful, modern UI** with Kazakhstani tenge (₸) pricing

### Partner App (Mobile)
- **Business registration** with verification system
- **Add surplus bags** with quantity and pickup times
- **Mark bags as sold out** when finished
- **Order management** with status updates
- **Pickup code verification** for customers
- **Sales analytics** and commission tracking

### Admin Panel (Web)
- **Dashboard** with real-time statistics and charts
- **Partner management** - approve, suspend, or remove partners
- **Order monitoring** with detailed transaction history
- **Commission tracking** and financial reports
- **Location management** for Almaty and future cities

## 🏗️ Architecture

```
YsrapEtpe/
├── server/                 # Backend API (Node.js/Express)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication & validation
│   └── index.js           # Main server file
├── mobile/                # Customer App (React Native/Expo)
│   ├── screens/           # App screens
│   ├── components/        # Reusable components
│   └── App.js            # Main app file
├── admin/                 # Admin Panel (React)
│   ├── src/
│   │   ├── components/    # Dashboard components
│   │   └── App.js        # Main admin app
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Expo CLI (for mobile development)
- Git

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd YsrapEtpe

# Install all dependencies
npm run install-all
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ysrap-etpe
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Start the Admin Panel

```bash
cd admin
npm start
```

The admin panel will be available at `http://localhost:3000`

### 5. Start the Mobile App

```bash
cd mobile
npm start
```

This will open Expo DevTools where you can run the app on:
- iOS Simulator
- Android Emulator
- Physical device via Expo Go app

## 📱 Mobile App Setup

### For iOS Development
1. Install Xcode
2. Install iOS Simulator
3. Run `npm run ios` in the mobile directory

### For Android Development
1. Install Android Studio
2. Set up Android Emulator
3. Run `npm run android` in the mobile directory

### For Physical Device Testing
1. Install Expo Go app from App Store/Play Store
2. Scan the QR code from Expo DevTools

## 🗄️ Database Schema

### Partners Collection
```javascript
{
  businessName: String,
  email: String,
  phone: String,
  password: String (hashed),
  address: {
    street: String,
    city: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    bin: String
  },
  isActive: Boolean,
  isVerified: Boolean,
  rating: Number,
  totalOrders: Number,
  commission: Number
}
```

### Bags Collection
```javascript
{
  partner: ObjectId,
  title: String,
  description: String,
  originalPrice: Number,
  discountedPrice: Number,
  quantity: Number,
  availableQuantity: Number,
  pickupTime: {
    start: Date,
    end: Date
  },
  isActive: Boolean,
  isSoldOut: Boolean,
  category: String,
  tags: [String],
  image: String
}
```

### Orders Collection
```javascript
{
  customer: {
    name: String,
    phone: String,
    email: String
  },
  bag: ObjectId,
  partner: ObjectId,
  quantity: Number,
  totalPrice: Number,
  commission: Number,
  status: String,
  paymentStatus: String,
  paymentMethod: String,
  pickupCode: String,
  pickupTime: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Partner registration
- `POST /api/auth/login` - Partner login

### Bags
- `GET /api/bags` - Get all active bags (customers)
- `GET /api/bags/partner` - Get partner's bags
- `POST /api/bags` - Create new bag (partner)
- `PUT /api/bags/:id` - Update bag (partner)
- `PATCH /api/bags/:id/sold-out` - Mark as sold out

### Orders
- `POST /api/orders` - Create order (customer)
- `GET /api/orders/partner` - Get partner's orders
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/verify-pickup` - Verify pickup code

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/partners` - All partners
- `GET /api/admin/orders` - All orders
- `GET /api/admin/commission-report` - Commission report

## 🎨 UI/UX Features

### Customer App
- **Location-based discovery** using device GPS
- **Pull-to-refresh** for real-time updates
- **Category filtering** for easy browsing
- **Beautiful cards** with discount badges
- **Smooth animations** and transitions
- **Kazakhstani design elements** and colors

### Admin Panel
- **Responsive dashboard** with real-time charts
- **Modern card-based layout** with statistics
- **Interactive tables** with sorting and filtering
- **Toast notifications** for user feedback
- **Dark/light mode** support (planned)

## 🔒 Security Features

- **JWT authentication** for partner access
- **Password hashing** with bcrypt
- **Input validation** with express-validator
- **Rate limiting** to prevent abuse
- **CORS protection** for API security
- **Helmet.js** for security headers

## 💰 Payment Integration

The app supports multiple payment methods:
- **Card payments** (Visa, MasterCard)
- **Kaspi Bank** integration
- **Halyk Bank** integration
- **Cash payments** for pickup

## 📊 Analytics & Reporting

### Admin Dashboard
- **Real-time order tracking**
- **Revenue analytics** with charts
- **Partner performance** metrics
- **Commission calculations**
- **Geographic distribution** of orders

### Partner Analytics
- **Sales performance** tracking
- **Popular items** analysis
- **Customer feedback** system
- **Revenue projections**

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
cd server
npm run build

# Deploy to your preferred platform:
# - Heroku
# - DigitalOcean
# - AWS
# - Google Cloud
```

### Admin Panel Deployment
```bash
cd admin
npm run build

# Deploy the build folder to:
# - Netlify
# - Vercel
# - AWS S3
# - Any static hosting
```

### Mobile App Deployment
```bash
cd mobile
expo build:android  # For Android
expo build:ios      # For iOS
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Localization

The app is designed for the Central Asia market with:
- **Kazakhstani tenge (₸)** as the primary currency
- **Russian and Kazakh** language support (planned)
- **Local payment methods** integration
- **Regional business practices** consideration

## 📞 Support

For support and questions:
- Email: support@ysrapetpe.kz
- Phone: +7 (727) XXX-XX-XX
- Address: Almaty, Kazakhstan

---

**Built with ❤️ for Central Asia's sustainable future**
