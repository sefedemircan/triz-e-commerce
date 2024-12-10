import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';

// Layout bileşenleri
import { AppLayout } from '../components/Layout/Layout';
import { AdminLayout } from '../components/Admin/Layout';

// Lazy loading ile sayfa bileşenleri
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Profile = lazy(() => import('../pages/Profile'));
const Orders = lazy(() => import('../pages/Orders'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const Favorites = lazy(() => import('../pages/Favorites'));

// Admin sayfaları
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/Admin/Products'));
const AdminCategories = lazy(() => import('../pages/Admin/Categories'));
const AdminOrders = lazy(() => import('../pages/Admin/Orders'));
const AdminUsers = lazy(() => import('../pages/Admin/Users'));
const AdminSettings = lazy(() => import('../pages/Admin/Settings'));

// Yükleme ekranı bileşeni
const PageLoader = () => (
  <LoadingOverlay 
    visible={true} 
    overlayProps={{
      blur: 2
    }}
  />
);

import SearchResults from '../pages/Search';

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Ana sayfa rotaları */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="kategori/:slug" element={<CategoryPage />} />
          <Route path="kategori/:slug/:subSlug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>

        {/* Admin rotaları */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 yönlendirmesi */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
} 