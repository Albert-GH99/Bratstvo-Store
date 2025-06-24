import React, { useState, } from 'react';
import { ShoppingCart, Package, Home, ArrowLeft } from 'lucide-react';

// Main App component
const App = () => {
  // State for current page view: 'home', 'cart', 'checkout', 'order-confirmation'
  const [currentPage, setCurrentPage] = useState('home');
  // State for items in the shopping cart
  const [cartItems, setCartItems] = useState([]);
  // State for applied discount code
  const [discountCode, setDiscountCode] = useState('');
  // State for order details after checkout
  const [orderDetails, setOrderDetails] = useState(null);
  // State for customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  // Example product data
  const products = [
    { id: 1, name: 'Kopi Susu', price: 12.00, image: 'https://placehold.co/150x150/dbeafe/1e40af?text=Kopi' },
    { id: 2, name: 'Roti Bakar', price: 8.50, image: 'https://placehold.co/150x150/dbeafe/1e40af?text=Roti' },
    { id: 3, name: 'Nasi Lemak', price: 15.00, image: 'https://placehold.co/150x150/dbeafe/1e40af?text=Nasi' },
    { id: 4, name: 'Mee Goreng', price: 13.50, image: 'https://placehold.co/150x150/dbeafe/1e40af?text=Mee' },
    { id: 4, name: 'Baju', price: 30.00, image: 'https://placehold.co/150x150/dbeafe/1e40af?text=Baju' },
  ];

  // Example discount codes (simple flat discount for demonstration)
  const availableDiscounts = {
    'DISKAUN10': { type: 'percentage', value: 0.10 }, // 10% discount
    'POTONGAN5': { type: 'flat', value: 5.00 },     // RM5 flat discount
    'HAFIZSR': { type: 'flat', value: 10.00 },     // RM10 flat discount
    'MHHQ': { type: 'flat', value: 10.00 },     // RM10 flat discount
  };

  // Function to add item to cart or increase quantity if already exists
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to update item quantity in cart
  const updateQuantity = (id, quantity) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== id);
      }
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
    });
  };

  // Function to remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Calculate subtotal of items in cart
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate discount amount based on applied code and subtotal
  const calculateDiscountAmount = (subtotal) => {
    const discount = availableDiscounts[discountCode.toUpperCase()];
    if (discount) {
      if (discount.type === 'percentage') {
        return subtotal * discount.value;
      } else if (discount.type === 'flat') {
        return discount.value;
      }
    }
    return 0;
  };

  // Calculate total amount after discount
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount(subtotal);
    return Math.max(0, subtotal - discountAmount); // Ensure total doesn't go below zero
  };

  // Handle discount code input change
  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
  };

  // Handle customer info input change
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  // Process checkout
  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.phone) {
      alert('Sila isi semua maklumat pelanggan yang diperlukan.'); // Using alert for simplicity, a better UI would be a modal.
      return;
    }
    if (cartItems.length === 0) {
        alert('Troli anda kosong. Sila tambah item sebelum daftar keluar.');
        return;
    }

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount(subtotal);
    const finalTotal = calculateTotal();

    setOrderDetails({
      items: cartItems,
      customerInfo: customerInfo,
      subtotal: subtotal,
      discountApplied: discountCode.toUpperCase(),
      discountAmount: discountAmount,
      total: finalTotal,
      orderDate: new Date().toLocaleString(),
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}` // Simple unique ID
    });
    setCurrentPage('order-confirmation');
    // Clear cart and discount after successful checkout
    setCartItems([]);
    setDiscountCode('');
    setCustomerInfo({ name: '', email: '', address: '', phone: '' });
  };

  // Components for different pages

  // Home Page (Product Listing)
  const HomePage = () => (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Menu Kami</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover object-center" onError={(e) => e.target.src = 'https://placehold.co/150x150/dbeafe/1e40af?text=Tiada+Gambar'}/>
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{product.name}</h3>
              <p className="text-gray-900 font-bold text-lg mb-4">RM {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-colors duration-300 transform hover:scale-105"
              >
                Tambah ke Troli
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentPage('cart')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 flex items-center justify-center mx-auto"
        >
          <ShoppingCart className="mr-2" size={24} /> Lihat Troli ({cartItems.length})
        </button>
      </div>
    </div>
  );

  // Cart Page
  const CartPage = () => (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('home')} className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
          <ArrowLeft size={20} className="mr-1" /> Kembali ke Menu
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow text-center">Troli Beli-belah Anda</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Troli anda kosong.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0">
              <div className="flex items-center flex-grow">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" onError={(e) => e.target.src = 'https://placehold.co/64x64/e0f2fe/0369a1?text=Img'}/>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">RM {item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-full transition-colors"
                >
                  -
                </button>
                <span className="mx-3 text-lg font-semibold text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-full transition-colors"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full transition-colors"
                >
                  Buang
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-gray-200 text-right">
            <p className="text-xl font-bold text-gray-800">Jumlah Kecil: RM {calculateSubtotal().toFixed(2)}</p>
            <button
              onClick={() => setCurrentPage('checkout')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
            >
              Daftar Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Checkout Page
  const CheckoutPage = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount(subtotal);
    const total = calculateTotal();

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentPage('cart')} className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeft size={20} className="mr-1" /> Kembali ke Troli
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow text-center">Daftar Keluar</h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Maklumat Pelanggan</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Nama Penuh</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama anda"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">E-mel</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Nombor Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="012-3456789"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">Alamat Penghantaran</label>
                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alamat penuh anda"
                  required
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary & Payment */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 text-gray-700">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Jumlah Kecil:</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Diskaun ({discountCode || 'Tiada'}):</span>
                  <span>- RM {discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                  <span>Jumlah Keseluruhan:</span>
                  <span>RM {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Kod Diskaun</h3>
              <div className="flex">
                <input
                  type="text"
                  value={discountCode}
                  onChange={handleDiscountCodeChange}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kod diskaun"
                />
                <button
                  onClick={() => setDiscountCode(discountCode)} // Re-triggers discount calculation
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-r-md transition-colors"
                >
                  Guna
                </button>
              </div>
              {discountCode && !availableDiscounts[discountCode.toUpperCase()] && (
                <p className="text-red-500 text-sm mt-2">Kod diskaun tidak sah.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Kaedah Pembayaran</h3>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm">
                Pembayaran Tunai Semasa Penghantaran (Cash on Delivery)
              </div>
              {/* This is a placeholder; in a real app, this would involve payment gateway integration */}
            </div>

            <button
              onClick={handleCheckout}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full shadow-lg transition-colors duration-300 flex items-center justify-center"
            >
              <Package className="mr-2" size={24} /> Sahkan Pesanan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Order Confirmation Page
  const OrderConfirmationPage = () => (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6 text-center">Pesanan Berjaya!</h2>
      <p className="text-lg text-gray-700 mb-8 text-center">Terima kasih atas pesanan anda. Butiran pesanan anda adalah seperti berikut:</p>

      {orderDetails && (
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Butiran Pesanan #{orderDetails.orderId}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
            <div>
              <p><span className="font-semibold">Nama:</span> {orderDetails.customerInfo.name}</p>
              <p><span className="font-semibold">E-mel:</span> {orderDetails.customerInfo.email}</p>
              <p><span className="font-semibold">Telefon:</span> {orderDetails.customerInfo.phone}</p>
            </div>
            <div>
              <p><span className="font-semibold">Alamat:</span> {orderDetails.customerInfo.address}</p>
              <p><span className="font-semibold">Tarikh Pesanan:</span> {orderDetails.orderDate}</p>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-800 mb-3">Item Dipesan:</h4>
          <ul className="list-disc list-inside space-y-1 mb-6">
            {orderDetails.items.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>RM {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-4 text-right space-y-1">
            <p className="font-semibold">Jumlah Kecil: RM {orderDetails.subtotal.toFixed(2)}</p>
            <p className="text-red-600">Diskaun ({orderDetails.discountApplied || 'Tiada'}): - RM {orderDetails.discountAmount.toFixed(2)}</p>
            <p className="text-xl font-bold text-gray-900">Jumlah Keseluruhan: RM {orderDetails.total.toFixed(2)}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setCurrentPage('home')}
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 flex items-center"
      >
        <Home className="mr-2" size={24} /> Kembali ke Laman Utama
      </button>
    </div>
  );

  // Render the appropriate page based on currentPage state
  // Baris ini mesti berada di dalam komponen App. Kesilapan meletakkannya di luar akan menyebabkan ralat 'return outside of function'.
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#4C5633] font-sans antialiased">
      {/* Global Tailwind CSS import for Inter font and basic styles */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Custom styles for button hover effects - subtle lift and shadow */
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        /* Ensures the app takes full width and height on mobile for better responsiveness */
        #root, body, html {
            height: 100%;
            width: 100%;
        }
        `}
      </style>
      <header className="bg-[#3D452B] shadow-md p-4 flex justify-between items-center sticky top-0 z-10 rounded-b-lg">
        <h1 className="text-2xl font-bold text-white">Bratstvo Store</h1> {/* Nama ditukar di sini */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${currentPage === 'home' ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-[#5C6A48]'}`}
              >
                <Home className="mr-1" size={20} /> Laman Utama
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('cart')}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${currentPage === 'cart' ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-[#5C6A48]'}`}
              >
                <ShoppingCart className="mr-1" size={20} /> Troli ({cartItems.length})
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto py-8">
        {renderPage()} {/* Memanggil fungsi renderPage */}
      </main>

      <footer className="bg-[#3D452B] text-gray-300 text-center p-4 mt-8 rounded-t-lg">
        <p>&copy; 2025 Bratstvo Store. Hak Cipta Terpelihara.</p> {/* Nama ditukar di sini */}
      </footer>
    </div>
  );
};

export default App;
