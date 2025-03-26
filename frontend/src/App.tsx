import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Cart from './components/Cart/Cart';
import OrderForm from './components/Orders/OrderForm';
import Profile from './components/Profile/Profile';
import AdminPanel from "./components/Admin/AdminPanel";
import AdminProductForm from "./components/Admin/AdminProductForm";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/order" element={<OrderForm />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/" element={<ProductList />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/admin/products/new" element={<AdminProductForm />} />
                            <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;