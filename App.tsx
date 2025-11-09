
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ResellerRegisterPage } from './components/ResellerRegisterPage';
import { Cart } from './components/Cart';
import { Product, CartItem, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sns_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'reseller_register'>('landing');

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id);
      const price = currentUser.role === 'reseller' ? product.resellerPrice : product.price;
      
      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { id: product.id, name: product.name, price: price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sns_user', JSON.stringify(user));
    setCurrentView('landing');
  };

  const handleRegisterSuccess = (user: User) => {
    alert('Registration successful! Please log in.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sns_user');
    setCartItems([]);
    setCurrentView('landing');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
     if (newQuantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = () => {
    if(cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Order placed successfully! Total: ₹${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentView('register')} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setCurrentView('login')} />;
      case 'reseller_register':
        return <ResellerRegisterPage onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setCurrentView('login')} />;
      case 'landing':
      default:
        return (
          <LandingPage
            user={currentUser}
            products={products}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            onBecomeReseller={() => setCurrentView('reseller_register')}
          />
        );
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header
        user={currentUser}
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setCurrentView('login')}
        onLogoutClick={handleLogout}
      />
      <main>
        {renderView()}
      </main>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Canva Pro', description: 'Unlock premium features for stunning graphic designs, presentations, and videos.', price: 599, resellerPrice: 449, category: 'Software', imageUrl: 'https://via.placeholder.com/400x300.png/8A2BE2/FFFFFF?Text=Canva+Pro', validity: '1 Year' },
    { id: '2', name: 'GST Billing Software', description: 'Simplify your invoicing and tax filing with our intuitive GST-compliant software.', price: 1499, resellerPrice: 1199, category: 'Software', imageUrl: 'https://via.placeholder.com/400x300.png/5F9EA0/FFFFFF?Text=GST+Software', validity: 'Lifetime' },
    { id: '3', name: 'Netflix Premium', description: 'Stream unlimited movies and TV shows in Ultra HD on 4 screens.', price: 649, resellerPrice: 549, category: 'OTT', imageUrl: 'https://via.placeholder.com/400x300.png/E50914/FFFFFF?Text=Netflix', validity: '30 Days' },
    { id: '4', name: 'YouTube Premium', description: 'Enjoy ad-free videos, background play, and access to YouTube Music.', price: 129, resellerPrice: 99, category: 'OTT', imageUrl: 'https://via.placeholder.com/400x300.png/FF0000/FFFFFF?Text=YouTube', validity: '30 Days' },
    { id: '5', name: 'Grand Theft Auto V', description: 'Experience the critically acclaimed open-world action-adventure game.', price: 2499, resellerPrice: 1999, category: 'PC Games', imageUrl: 'https://via.placeholder.com/400x300.png/4CAF50/FFFFFF?Text=GTA+V', validity: 'Lifetime License' },
    { id: '6', name: 'YouTube Monetization', description: 'Fast-track your channel to meet monetization requirements and start earning.', price: 4999, resellerPrice: 3999, category: 'Monetization', imageUrl: 'https://via.placeholder.com/400x300.png/28B463/FFFFFF?Text=Monetize', validity: 'One-Time Service' },
    { id: '7', name: 'Google AdSense Account', description: 'A pre-approved AdSense account to start monetizing your website or blog instantly.', price: 3999, resellerPrice: 3199, category: 'AdSense Account', imageUrl: 'https://via.placeholder.com/400x300.png/4285F4/FFFFFF?Text=AdSense', validity: 'Account Ownership' },
    { id: '8', name: 'Digital Marketing Course', description: 'Master SEO, SMM, and content marketing with our comprehensive 20+ module course.', price: 1999, resellerPrice: 1499, category: 'Courses', imageUrl: 'https://via.placeholder.com/400x300.png/FFC107/000000?Text=Course', validity: 'Lifetime Access' },
    { id: '9', name: 'Viral Reels Bundle', description: 'Get access to 75,000+ viral reels templates to boost your social media presence.', price: 799, resellerPrice: 599, category: 'Content Bundles', imageUrl: 'https://via.placeholder.com/400x300.png/9C27B0/FFFFFF?Text=Reels', validity: 'One-Time Download' },
];

export default App;
