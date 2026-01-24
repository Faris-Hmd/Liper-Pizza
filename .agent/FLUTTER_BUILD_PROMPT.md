# 🍕 Liper Pizza - Flutter + Firebase Build Specification

## Project Overview

Build a premium pizza delivery mobile application using **Flutter** and **Firebase** with Arabic language support (RTL). The app features a maroon and charcoal color scheme, modern UI/UX with glassmorphism effects, and comprehensive e-commerce functionality.

---

## 🎨 Design System

### Brand Identity

- **App Name (Arabic)**: لييبر بيتزا (Liper Pizza)
- **Tagline**: أطيب بيتزا في مدينتك - جودة عالية وطعم لا يقاوم
- **Primary Color**: Maroon (#800000)
- **Secondary Color**: Charcoal (#1a1a1a)
- **Accent Color**: Brownish Red (#a52a2a)

### Color Palette

#### Light Theme

```dart
// Background & Foreground
backgroundColor: Color(0xFFFFFCF9),  // Off-white warm
foregroundColor: Color(0xFF1A0F0A),  // Dark chocolate

// Brand Colors
primaryColor: Color(0xFF800000),     // Maroon
secondaryColor: Color(0xFF1A1A1A),   // Charcoal
accentColor: Color(0xFFA52A2A),      // Brownish Red

// UI Elements
cardColor: Color(0xFFFFFFFF),
mutedColor: Color(0xFFFFF5F5),       // Subtle maroon hint
borderColor: Color(0xFFEBDADA),      // Maroon-tinted border

// Status Colors
successColor: Color(0xFF10B981),
warningColor: Color(0xFFF59E0B),
errorColor: Color(0xFF800000),
infoColor: Color(0xFF3B82F6),
```

#### Dark Theme

```dart
backgroundColor: Color(0xFF1A1A1A),
foregroundColor: Color(0xFFFFFFFF),
primaryColor: Color(0xFFB91C1C),     // Brighter maroon
cardColor: Color(0xFF1A1A1A),
mutedColor: Color(0xFF111111),
borderColor: Color(0xFF4A3737),      // Stronger maroon tint

// Status Colors (Dark)
successColor: Color(0xFF34D399),
warningColor: Color(0xFFFBBF24),
errorColor: Color(0xFFEF4444),
infoColor: Color(0xFF60A5FA),
```

### Typography

- **Primary Font**: Nunito (Google Fonts)
- **Font Sizes**:
  - Tiny: 10px
  - Small: 12px
  - Medium: 14px
  - Base: 16px
  - Big: 18px
  - Large: 20px
  - Huge: 24px

### Border Radius

- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px

### Shadows

```dart
// Maroon-tinted shadows
BoxShadow(
  color: Color(0xFF800000).withOpacity(0.1),
  blurRadius: 6,
  offset: Offset(0, 4),
)

BoxShadow(
  color: Color(0xFF800000).withOpacity(0.1),
  blurRadius: 15,
  offset: Offset(0, 10),
)
```

---

## 📱 Core Features & Screens

### 1. Authentication System

**Firebase Authentication with Google Sign-In**

#### Login Screen (`/login`)

- Google Sign-In button
- Email/Password authentication (optional)
- Auto-redirect if already authenticated
- Beautiful gradient background with pizza imagery

#### User Profile (`/profile`)

- Display user info (name, email, profile picture)
- Shipping address management
- Order history summary
- Account settings
- Logout functionality

---

### 2. Home Screen (`/`)

**Main landing page with:**

#### Hero Section

- Large banner with promotional content
- Call-to-action buttons
- Animated background with maroon gradients

#### Featured Products Carousel

- Horizontal scrolling carousel
- Auto-play with 3-second intervals
- Product cards with:
  - Product image
  - Name (Arabic)
  - Price
  - Quick add to cart button

#### Offers Carousel

- Special deals and combo offers
- Badge display (e.g., "وفر 20 ريال")
- Savings calculation display
- Navigate to offer details on tap

#### Categories Section

- Grid of product categories:
  - بيتزا (Pizza)
  - مشروبات (Drinks)
  - حلويات (Desserts)
  - سلطات (Salads)
  - مقبلات (Appetizers)
  - عروض خاصة (Special Offers)

#### Bottom Navigation Bar

- Home (الرئيسية)
- Products (المنتجات)
- Offers (العروض)
- Cart (السلة)
- Profile (الحساب)

---

### 3. Products Screen (`/products`)

#### Product Listing

- Grid layout (2 columns on mobile, 3-4 on tablet)
- Product cards with:
  - Multiple images (swipeable)
  - Product name (Arabic)
  - Category
  - Price
  - Add to cart button
  - Quick view option

#### Filtering & Sorting

- Filter by category
- Sort by:
  - Price (low to high / high to low)
  - Name (alphabetical)
  - Newest first
- Search functionality

#### Product Detail Screen (`/products/[id]`)

- Image gallery (swipeable)
- Product name and description
- Price display
- Quantity selector
- Add to cart button
- Related products section

---

### 4. Offers Screen (`/offers`)

#### Offers List

- Grid of special offers
- Each offer card shows:
  - Offer image
  - Title and description
  - Included products
  - Original price vs. Offer price
  - Savings amount
  - Badge (if applicable)

#### Offer Detail Screen (`/offers/[id]`)

- Full offer details
- List of included products with images
- Price breakdown
- Savings calculation
- Add to cart functionality
- Checkout directly from offer

---

### 5. Shopping Cart (`/cart`)

#### Cart Display

- List of cart items
- Each item shows:
  - Product image
  - Name
  - Price
  - Quantity controls (+/-)
  - Remove button
  - Subtotal

#### Cart Summary

- Subtotal
- Delivery fee (if applicable)
- Total amount
- Checkout button

#### Empty Cart State

- Friendly message
- "Continue Shopping" button
- Suggested products

---

### 6. Checkout Flow

#### Shipping Information (`/shipping-info`)

- Address form:
  - Full address
  - City
  - ZIP code
  - Phone number
- Google Maps integration:
  - Location picker
  - Save coordinates (latitude, longitude)
  - Generate Google Maps link
- Save shipping info to user profile

#### Order Confirmation Modal

- Review order details
- Product list
- Shipping information
- Total amount
- Payment method selection
- Confirm order button

#### Payment Integration

- Stripe payment gateway
- Payment methods:
  - Credit/Debit card
  - Cash on delivery
- Transaction reference storage

---

### 7. Orders Screen (`/orders`)

#### Order List

- Display all user orders
- Order cards showing:
  - Order ID
  - Order date (formatted in Arabic)
  - Status badge (Processing, Shipped, Delivered, Cancelled)
  - Total amount
  - Driver info (if assigned)
  - Tap to view details

#### Order Detail Screen (`/orders/[id]`)

- Full order information:
  - Order ID and date
  - Status timeline
  - Product list with quantities
  - Billing summary
  - Shipping details
  - Google Maps link to delivery address
  - Driver information (name, phone, vehicle)
  - Track order button

#### Order History (`/orders/history`)

- Filter to show only delivered orders
- Collapsible order cards
- Reorder functionality

---

### 8. Additional Screens

#### About Us (`/about`)

- Company information
- Mission and values
- Contact information

#### Contact Us (`/contact-us`)

- Contact form with WhatsApp integration
- Form fields:
  - Name
  - Email
  - Subject
  - Message
- Submit button opens WhatsApp with pre-filled message

#### Terms & Conditions (`/terms`)

- Legal information
- Privacy policy
- Terms of service

---

## 🗄️ Data Models

### 1. Product Type

```dart
class Product {
  final String id;
  final String pName;           // p_name
  final dynamic pCost;          // p_cost (can be number or string)
  final String pCat;            // p_cat (category)
  final String pDetails;        // p_details (description)
  final List<ProductImage> pImgs; // p_imgs (images)
  final dynamic createdAt;      // timestamp
  final int? pQu;               // p_qu (quantity in cart)
  final bool? isFeatured;       // featured flag

  Product({
    required this.id,
    required this.pName,
    required this.pCost,
    required this.pCat,
    required this.pDetails,
    required this.pImgs,
    this.createdAt,
    this.pQu,
    this.isFeatured,
  });

  factory Product.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Product(
      id: doc.id,
      pName: data['p_name'] ?? '',
      pCost: data['p_cost'] ?? 0,
      pCat: data['p_cat'] ?? '',
      pDetails: data['p_details'] ?? '',
      pImgs: (data['p_imgs'] as List?)
          ?.map((img) => ProductImage.fromMap(img))
          .toList() ?? [],
      createdAt: data['createdAt'],
      pQu: data['p_qu'],
      isFeatured: data['isFeatured'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'p_name': pName,
      'p_cost': pCost,
      'p_cat': pCat,
      'p_details': pDetails,
      'p_imgs': pImgs.map((img) => img.toMap()).toList(),
      'createdAt': createdAt,
      'p_qu': pQu,
      'isFeatured': isFeatured,
    };
  }
}

class ProductImage {
  final String url;
  final dynamic productImgFile; // Optional, for upload

  ProductImage({required this.url, this.productImgFile});

  factory ProductImage.fromMap(Map<String, dynamic> map) {
    return ProductImage(
      url: map['url'] ?? '',
      productImgFile: map['productImgFile'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'url': url,
      if (productImgFile != null) 'productImgFile': productImgFile,
    };
  }
}
```

### 2. Order Type

```dart
class OrderData {
  final String id;
  final String? customerEmail;
  final String? customerName;
  final ShippingInfo? shippingInfo;
  final List<Product> productsList;
  final String status; // Processing, Shipped, Delivered, Cancelled
  final int createdAt;        // Milliseconds since epoch
  final int? deliveredAt;     // Milliseconds - delivery timestamp
  final double totalAmount;
  final String? driverId;
  final String? paymentMethod;
  final String? transactionReference;

  // Offer fields
  final bool? isOffer;
  final String? offerId;
  final String? offerTitle;
  final String? offerImage;

  OrderData({
    required this.id,
    this.customerEmail,
    this.customerName,
    this.shippingInfo,
    required this.productsList,
    required this.status,
    required this.createdAt,
    this.deliveredAt,
    required this.totalAmount,
    this.driverId,
    this.paymentMethod,
    this.transactionReference,
    this.isOffer,
    this.offerId,
    this.offerTitle,
    this.offerImage,
  });

  factory OrderData.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return OrderData(
      id: doc.id,
      customerEmail: data['customer_email'],
      customerName: data['customer_name'],
      shippingInfo: data['shippingInfo'] != null
          ? ShippingInfo.fromMap(data['shippingInfo'])
          : null,
      productsList: (data['productsList'] as List?)
          ?.map((p) => Product.fromMap(p))
          .toList() ?? [],
      status: data['status'] ?? 'Processing',
      createdAt: data['createdAt'] ?? DateTime.now().millisecondsSinceEpoch,
      deliveredAt: data['deliveredAt'],
      totalAmount: (data['totalAmount'] ?? 0).toDouble(),
      driverId: data['driverId'],
      paymentMethod: data['paymentMethod'],
      transactionReference: data['transactionReference'],
      isOffer: data['isOffer'],
      offerId: data['offerId'],
      offerTitle: data['offerTitle'],
      offerImage: data['offerImage'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'customer_email': customerEmail,
      'customer_name': customerName,
      'shippingInfo': shippingInfo?.toMap(),
      'productsList': productsList.map((p) => p.toMap()).toList(),
      'status': status,
      'createdAt': createdAt,
      'deliveredAt': deliveredAt,
      'totalAmount': totalAmount,
      'driverId': driverId,
      'paymentMethod': paymentMethod,
      'transactionReference': transactionReference,
      'isOffer': isOffer,
      'offerId': offerId,
      'offerTitle': offerTitle,
      'offerImage': offerImage,
    };
  }
}
```

### 3. User Type

```dart
class UserData {
  final String email;
  final String? name;
  final String? image;
  final ShippingInfo? shippingInfo;
  final String? updatedAt;

  UserData({
    required this.email,
    this.name,
    this.image,
    this.shippingInfo,
    this.updatedAt,
  });

  factory UserData.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return UserData(
      email: data['email'] ?? '',
      name: data['name'],
      image: data['image'],
      shippingInfo: data['shippingInfo'] != null
          ? ShippingInfo.fromMap(data['shippingInfo'])
          : null,
      updatedAt: data['updatedAt'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'name': name,
      'image': image,
      'shippingInfo': shippingInfo?.toMap(),
      'updatedAt': updatedAt,
    };
  }
}

class ShippingInfo {
  final String address;
  final String city;
  final String zip;
  final String phone;
  final String? googleMapsLink;
  final double? latitude;
  final double? longitude;

  ShippingInfo({
    required this.address,
    required this.city,
    required this.zip,
    required this.phone,
    this.googleMapsLink,
    this.latitude,
    this.longitude,
  });

  factory ShippingInfo.fromMap(Map<String, dynamic> map) {
    return ShippingInfo(
      address: map['address'] ?? '',
      city: map['city'] ?? '',
      zip: map['zip'] ?? '',
      phone: map['phone'] ?? '',
      googleMapsLink: map['googleMapsLink'],
      latitude: map['latitude']?.toDouble(),
      longitude: map['longitude']?.toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'address': address,
      'city': city,
      'zip': zip,
      'phone': phone,
      'googleMapsLink': googleMapsLink,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}
```

### 4. Offer Type

```dart
class Offer {
  final String id;
  final String title;
  final String description;
  final String image;
  final List<Product> products;
  final String? badge;
  final double? price; // Special offer price

  Offer({
    required this.id,
    required this.title,
    required this.description,
    required this.image,
    required this.products,
    this.badge,
    this.price,
  });

  factory Offer.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Offer(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      image: data['image'] ?? '',
      products: (data['products'] as List?)
          ?.map((p) => Product.fromMap(p))
          .toList() ?? [],
      badge: data['badge'],
      price: data['price']?.toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'image': image,
      'products': products.map((p) => p.toMap()).toList(),
      'badge': badge,
      'price': price,
    };
  }

  // Calculate savings
  double calculateSavings() {
    double originalTotal = products.fold(0, (sum, p) => sum + (p.pCost as num).toDouble());
    return originalTotal - (price ?? originalTotal);
  }
}
```

### 5. Driver Type

```dart
class Driver {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String vehicle;
  final String status; // Active, Inactive
  final List<String>? currentOrders; // Order IDs
  final String? updatedAt;

  Driver({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.vehicle,
    required this.status,
    this.currentOrders,
    this.updatedAt,
  });

  factory Driver.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Driver(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'] ?? '',
      vehicle: data['vehicle'] ?? '',
      status: data['status'] ?? 'Inactive',
      currentOrders: (data['currentOrders'] as List?)?.cast<String>(),
      updatedAt: data['updatedAt'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'vehicle': vehicle,
      'status': status,
      'currentOrders': currentOrders,
      'updatedAt': updatedAt,
    };
  }
}
```

---

## 🔥 Firebase Configuration

### Firestore Collections Structure

#### 1. `products` Collection

```
products/
  {productId}/
    - id: string
    - p_name: string
    - p_cost: number
    - p_cat: string
    - p_details: string
    - p_imgs: array of {url: string}
    - createdAt: timestamp
    - isFeatured: boolean
```

#### 2. `orders` Collection

```
orders/
  {orderId}/
    - id: string
    - customer_email: string
    - customer_name: string
    - shippingInfo: object
    - productsList: array of products
    - status: string
    - createdAt: number (milliseconds)
    - deliveredAt: number (optional)
    - totalAmount: number
    - driverId: string (optional)
    - paymentMethod: string
    - transactionReference: string
    - isOffer: boolean
    - offerId: string (optional)
    - offerTitle: string (optional)
    - offerImage: string (optional)
```

#### 3. `users` Collection

```
users/
  {userEmail}/
    - email: string
    - name: string
    - image: string
    - shippingInfo: object
    - updatedAt: timestamp
```

#### 4. `offers` Collection

```
offers/
  {offerId}/
    - id: string
    - title: string
    - description: string
    - image: string
    - products: array of products
    - badge: string (optional)
    - price: number (optional)
```

#### 5. `drivers` Collection

```
drivers/
  {driverId}/
    - id: string
    - name: string
    - email: string
    - phone: string
    - vehicle: string
    - status: string
    - currentOrders: array of order IDs
    - updatedAt: timestamp
```

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products - Read by all, write by admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Orders - Users can read their own orders, create new ones
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                     (resource.data.customer_email == request.auth.token.email ||
                      request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.token.admin == true;
    }

    // Users - Users can read/write their own data
    match /users/{userEmail} {
      allow read, write: if request.auth != null &&
                            request.auth.token.email == userEmail;
    }

    // Offers - Read by all, write by admin only
    match /offers/{offerId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Drivers - Read by authenticated users, write by admin only
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 📦 Required Flutter Packages

```yaml
dependencies:
  flutter:
    sdk: flutter

  # Firebase
  firebase_core: ^3.8.1
  firebase_auth: ^5.3.3
  cloud_firestore: ^5.5.2
  firebase_storage: ^12.3.6

  # Google Sign-In
  google_sign_in: ^6.2.2

  # State Management
  provider: ^6.1.2
  # OR
  riverpod: ^2.6.1

  # UI Components
  cached_network_image: ^3.4.1
  carousel_slider: ^5.0.0
  flutter_svg: ^2.0.10+1
  shimmer: ^3.0.0

  # Maps & Location
  google_maps_flutter: ^2.9.0
  geolocator: ^13.0.2
  geocoding: ^3.0.0
  url_launcher: ^6.3.1

  # Payment
  flutter_stripe: ^11.2.0

  # Utilities
  intl: ^0.19.0 # For date formatting
  shared_preferences: ^2.3.3
  image_picker: ^1.1.2

  # HTTP & API
  http: ^1.2.2

  # Animations
  flutter_animate: ^4.5.0
  lottie: ^3.1.3

  # Icons
  flutter_launcher_icons: ^0.14.1

  # Arabic/RTL Support
  easy_localization: ^3.0.7

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
```

---

## 🎯 Key Implementation Details

### 1. State Management

Use **Provider** or **Riverpod** for:

- Cart state (persistent with SharedPreferences)
- User authentication state
- Theme state (light/dark mode)
- Product filters and sorting

### 2. Cart Functionality

```dart
class CartProvider extends ChangeNotifier {
  List<Product> _cartItems = [];

  List<Product> get cartItems => _cartItems;

  int get itemCount => _cartItems.length;

  double get totalAmount {
    return _cartItems.fold(0, (sum, item) {
      double price = (item.pCost is String)
          ? double.parse(item.pCost)
          : item.pCost.toDouble();
      return sum + (price * (item.pQu ?? 1));
    });
  }

  void addToCart(Product product, {int quantity = 1}) {
    final existingIndex = _cartItems.indexWhere((item) => item.id == product.id);

    if (existingIndex >= 0) {
      _cartItems[existingIndex] = Product(
        ...product,
        pQu: (_cartItems[existingIndex].pQu ?? 0) + quantity,
      );
    } else {
      _cartItems.add(Product(...product, pQu: quantity));
    }

    _saveCart();
    notifyListeners();
  }

  void removeFromCart(String productId) {
    _cartItems.removeWhere((item) => item.id == productId);
    _saveCart();
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity) {
    final index = _cartItems.indexWhere((item) => item.id == productId);
    if (index >= 0) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        _cartItems[index] = Product(..._cartItems[index], pQu: quantity);
        _saveCart();
        notifyListeners();
      }
    }
  }

  void clearCart() {
    _cartItems.clear();
    _saveCart();
    notifyListeners();
  }

  Future<void> _saveCart() async {
    final prefs = await SharedPreferences.getInstance();
    final cartJson = jsonEncode(_cartItems.map((item) => item.toMap()).toList());
    await prefs.setString('cart', cartJson);
  }

  Future<void> loadCart() async {
    final prefs = await SharedPreferences.getInstance();
    final cartJson = prefs.getString('cart');
    if (cartJson != null) {
      final List<dynamic> decoded = jsonDecode(cartJson);
      _cartItems = decoded.map((item) => Product.fromMap(item)).toList();
      notifyListeners();
    }
  }
}
```

### 3. Firebase Services

#### Product Service

```dart
class ProductService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get all products
  Stream<List<Product>> getProducts() {
    return _firestore
        .collection('products')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc))
            .toList());
  }

  // Get featured products
  Stream<List<Product>> getFeaturedProducts() {
    return _firestore
        .collection('products')
        .where('isFeatured', isEqualTo: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc))
            .toList());
  }

  // Get products by category
  Stream<List<Product>> getProductsByCategory(String category) {
    return _firestore
        .collection('products')
        .where('p_cat', isEqualTo: category)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc))
            .toList());
  }

  // Get single product
  Future<Product?> getProduct(String productId) async {
    final doc = await _firestore.collection('products').doc(productId).get();
    if (doc.exists) {
      return Product.fromFirestore(doc);
    }
    return null;
  }
}
```

#### Order Service

```dart
class OrderService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Create new order
  Future<String> createOrder(OrderData order) async {
    final docRef = await _firestore.collection('orders').add(order.toMap());
    return docRef.id;
  }

  // Get user orders
  Stream<List<OrderData>> getUserOrders(String userEmail) {
    return _firestore
        .collection('orders')
        .where('customer_email', isEqualTo: userEmail)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderData.fromFirestore(doc))
            .toList());
  }

  // Get delivered orders (history)
  Stream<List<OrderData>> getDeliveredOrders(String userEmail) {
    return _firestore
        .collection('orders')
        .where('customer_email', isEqualTo: userEmail)
        .where('status', isEqualTo: 'Delivered')
        .orderBy('deliveredAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderData.fromFirestore(doc))
            .toList());
  }

  // Get single order
  Future<OrderData?> getOrder(String orderId) async {
    final doc = await _firestore.collection('orders').doc(orderId).get();
    if (doc.exists) {
      return OrderData.fromFirestore(doc);
    }
    return null;
  }
}
```

### 4. Arabic Date Formatting

```dart
String formatArabicDate(int milliseconds) {
  final date = DateTime.fromMillisecondsSinceEpoch(milliseconds);
  final formatter = DateFormat('dd MMMM yyyy, hh:mm a', 'ar');
  return formatter.format(date);
}
```

### 5. WhatsApp Integration

```dart
Future<void> sendWhatsAppMessage({
  required String name,
  required String email,
  required String subject,
  required String message,
}) async {
  final phoneNumber = '249123456789'; // Your WhatsApp number
  final text = '''
مرحباً، أنا $name

البريد الإلكتروني: $email
الموضوع: $subject

الرسالة:
$message
  ''';

  final url = 'https://wa.me/$phoneNumber?text=${Uri.encodeComponent(text)}';

  if (await canLaunchUrl(Uri.parse(url))) {
    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  } else {
    throw 'Could not launch WhatsApp';
  }
}
```

### 6. Google Maps Integration

```dart
// Generate Google Maps link
String generateMapsLink(double latitude, double longitude) {
  return 'https://www.google.com/maps?q=$latitude,$longitude';
}

// Location Picker Widget
class LocationPicker extends StatefulWidget {
  final Function(double lat, double lng) onLocationSelected;

  const LocationPicker({required this.onLocationSelected});

  @override
  _LocationPickerState createState() => _LocationPickerState();
}

class _LocationPickerState extends State<LocationPicker> {
  GoogleMapController? _controller;
  LatLng? _selectedLocation;

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      onMapCreated: (controller) => _controller = controller,
      onTap: (position) {
        setState(() {
          _selectedLocation = position;
        });
        widget.onLocationSelected(position.latitude, position.longitude);
      },
      markers: _selectedLocation != null
          ? {
              Marker(
                markerId: MarkerId('selected'),
                position: _selectedLocation!,
              ),
            }
          : {},
      initialCameraPosition: CameraPosition(
        target: LatLng(15.5007, 32.5599), // Khartoum coordinates
        zoom: 12,
      ),
    );
  }
}
```

### 7. Stripe Payment Integration

```dart
class PaymentService {
  Future<void> makePayment({
    required double amount,
    required String currency,
  }) async {
    try {
      // Create payment intent on your backend
      final paymentIntent = await createPaymentIntent(
        amount: (amount * 100).toInt().toString(),
        currency: currency,
      );

      // Initialize payment sheet
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: paymentIntent['client_secret'],
          merchantDisplayName: 'Liper Pizza',
          style: ThemeMode.system,
        ),
      );

      // Present payment sheet
      await Stripe.instance.presentPaymentSheet();

      // Payment successful
      return;
    } catch (e) {
      // Handle error
      throw Exception('Payment failed: $e');
    }
  }

  Future<Map<String, dynamic>> createPaymentIntent({
    required String amount,
    required String currency,
  }) async {
    // Call your backend API to create payment intent
    final response = await http.post(
      Uri.parse('YOUR_BACKEND_URL/create-payment-intent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'amount': amount,
        'currency': currency,
      }),
    );

    return jsonDecode(response.body);
  }
}
```

---

## 🎨 UI Components

### 1. Product Card

```dart
class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({required this.product, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Color(0xFF800000).withOpacity(0.1),
              blurRadius: 6,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
              child: CachedNetworkImage(
                imageUrl: product.pImgs.isNotEmpty ? product.pImgs[0].url : '',
                height: 150,
                width: double.infinity,
                fit: BoxFit.cover,
                placeholder: (context, url) => Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Container(color: Colors.white),
                ),
              ),
            ),

            Padding(
              padding: EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product Name
                  Text(
                    product.pName,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  SizedBox(height: 4),

                  // Category
                  Text(
                    product.pCat,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),

                  SizedBox(height: 8),

                  // Price and Add Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${product.pCost} ريال',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF800000),
                        ),
                      ),

                      IconButton(
                        icon: Icon(Icons.add_shopping_cart),
                        color: Color(0xFF800000),
                        onPressed: () {
                          Provider.of<CartProvider>(context, listen: false)
                              .addToCart(product);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('تمت الإضافة إلى السلة')),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2. Status Badge

```dart
class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({required this.status});

  Color _getStatusColor() {
    switch (status) {
      case 'Processing':
        return Color(0xFFF59E0B); // Warning
      case 'Shipped':
        return Color(0xFF3B82F6); // Info
      case 'Delivered':
        return Color(0xFF10B981); // Success
      case 'Cancelled':
        return Color(0xFF800000); // Error
      default:
        return Colors.grey;
    }
  }

  String _getStatusText() {
    switch (status) {
      case 'Processing':
        return 'قيد المعالجة';
      case 'Shipped':
        return 'تم الشحن';
      case 'Delivered':
        return 'تم التوصيل';
      case 'Cancelled':
        return 'ملغي';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _getStatusColor().withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _getStatusColor()),
      ),
      child: Text(
        _getStatusText(),
        style: TextStyle(
          color: _getStatusColor(),
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
```

---

## 🌐 RTL (Right-to-Left) Support

### Configure in `main.dart`

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  runApp(
    EasyLocalization(
      supportedLocales: [Locale('ar')],
      path: 'assets/translations',
      fallbackLocale: Locale('ar'),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'لييبر بيتزا',
      locale: Locale('ar'),
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,

      // Force RTL
      builder: (context, child) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: child!,
        );
      },

      theme: ThemeData(
        primaryColor: Color(0xFF800000),
        fontFamily: 'Nunito',
        // ... other theme properties
      ),

      darkTheme: ThemeData.dark().copyWith(
        primaryColor: Color(0xFFB91C1C),
        // ... other dark theme properties
      ),

      home: SplashScreen(),
    );
  }
}
```

---

## 🚀 Deployment Checklist

### 1. Firebase Setup

- [ ] Create Firebase project
- [ ] Enable Authentication (Google Sign-In)
- [ ] Create Firestore database
- [ ] Set up Security Rules
- [ ] Configure Firebase Storage (for images)
- [ ] Add Android/iOS apps to Firebase project
- [ ] Download and add `google-services.json` (Android)
- [ ] Download and add `GoogleService-Info.plist` (iOS)

### 2. Stripe Setup

- [ ] Create Stripe account
- [ ] Get publishable and secret keys
- [ ] Set up backend for payment intent creation
- [ ] Configure webhook endpoints

### 3. Google Maps Setup

- [ ] Enable Google Maps SDK for Android/iOS
- [ ] Get API keys
- [ ] Add API keys to AndroidManifest.xml and Info.plist

### 4. App Configuration

- [ ] Update app name and package name
- [ ] Configure app icons
- [ ] Set up splash screen
- [ ] Configure deep linking (for WhatsApp return)

### 5. Testing

- [ ] Test authentication flow
- [ ] Test product browsing and filtering
- [ ] Test cart functionality
- [ ] Test checkout and payment
- [ ] Test order creation and tracking
- [ ] Test WhatsApp integration
- [ ] Test on both Android and iOS
- [ ] Test RTL layout on all screens

### 6. Performance

- [ ] Optimize images (use WebP format)
- [ ] Implement lazy loading for product lists
- [ ] Cache network images
- [ ] Minimize Firestore reads (use pagination)

---

## 📝 Additional Notes

### Category Mapping (Arabic)

```dart
const Map<String, String> categoryMapping = {
  'pizza': 'بيتزا',
  'drinks': 'مشروبات',
  'desserts': 'حلويات',
  'salads': 'سلطات',
  'appetizers': 'مقبلات',
  'special_offers': 'عروض خاصة',
};
```

### Error Handling

Implement comprehensive error handling for:

- Network failures
- Firebase errors
- Payment failures
- Location permission denials
- Image loading failures

### Loading States

Use shimmer effects and skeleton screens for:

- Product grids
- Order lists
- Profile data
- Carousels

### Offline Support

- Cache products locally
- Queue orders when offline
- Sync when connection restored

---

## 🎯 Success Criteria

Your Flutter app should:

1. ✅ Have a beautiful, premium UI with maroon theme
2. ✅ Support full RTL (Arabic) layout
3. ✅ Implement smooth animations and transitions
4. ✅ Work seamlessly with Firebase backend
5. ✅ Handle cart persistence across app restarts
6. ✅ Process payments securely via Stripe
7. ✅ Integrate WhatsApp for customer support
8. ✅ Display orders with real-time status updates
9. ✅ Support Google Maps for delivery locations
10. ✅ Provide excellent user experience on both Android and iOS

---

**Built with ❤️ for Liper Pizza**
