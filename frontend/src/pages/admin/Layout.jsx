import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../lib/auth'

// Icon components for a more professional look
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
);
const ProductsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 012.586 13H11a1 1 0 00.914-.586l.707-.707A6 6 0 0010 2zm5 5H9a1 1 0 010-2h6a1 1 0 110 2z" /></svg>
);
const CategoriesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.25a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H10a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-2.25a.75.75 0 00-1.5 0V17a.75.75 0 000 1.5h1.25a.75.75 0 000-1.5H5a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
);
const TablesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 10-2 0v2a1 1 0 102 0v-2zm4-2a1 1 0 10-2 0v4a1 1 0 102 0V8zm-2 2a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" /></svg>
);
const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0117 8.414V16a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm2 2v4h4V7H6zm.75-2.25A1.5 1.5 0 005.25 6V5a.5.5 0 011 0v1.5h2V5a.5.5 0 011 0v2a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V5a1.5 1.5 0 00-1.5 1.5v1.75a.75.75 0 001.5 0V7z" clipRule="evenodd" /></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

export default function AdminLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <aside className="fixed lg:static inset-y-0 left-0 w-64 lg:w-auto bg-gray-900 text-gray-200 border-r border-gray-700 p-4 space-y-8 flex flex-col z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
                {/* Brand/Logo */}
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Yönetim Paneli</div>
                    {/* Placeholder for future sidebar toggle button */}
                </div>
                {/* Navigation Menu */}
                <nav className="flex flex-col gap-2 flex-1">
                    <NavLink to="/admin" active={pathname === '/admin'}>
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/products" active={pathname.startsWith('/admin/products')}>
                        <ProductsIcon />
                        <span>Ürünler</span>
                    </NavLink>
                    <NavLink to="/admin/categories" active={pathname.startsWith('/admin/categories')}>
                        <CategoriesIcon />
                        <span>Kategoriler</span>
                    </NavLink>
                    <NavLink to="/admin/tables" active={pathname.startsWith('/admin/tables')}>
                        <TablesIcon />
                        <span>Masalar</span>
                    </NavLink>
                    <NavLink to="/admin/orders" active={pathname.startsWith('/admin/orders')}>
                        <OrdersIcon />
                        <span>Siparişler</span>
                    </NavLink>
                </nav>
                {/* Logout Button */}
                <div className="p-4">
                    <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                        onClick={() => { clearToken(); navigate('/admin/login', { replace: true }) }}
                    >
                        <LogoutIcon />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <div className="text-xl font-semibold text-gray-700">Sayfa Adı</div>
                    <div className="flex items-center space-x-4">
                        {/* Placeholder for user avatar, notifications etc. */}
                        <div className="text-sm text-gray-500 hidden sm:block">Hoş Geldiniz!</div>
                    </div>
                </header>

                {/* Content Wrapper */}
                <div className="p-4 md:p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

// NavLink Component with better styling
function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                active
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {children}
        </Link>
    );
}