import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import TableMenu from './pages/TableMenu'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminLayout from './pages/admin/Layout'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Tables from './pages/admin/Tables'
import Orders from './pages/admin/Orders'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table/:number" element={<TableMenu />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="tables" element={<Tables />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<Navigate to="/table/5" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
