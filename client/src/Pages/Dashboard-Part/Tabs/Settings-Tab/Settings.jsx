import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { pathname } = useLocation();

    return (
        <aside id="default-sidebar" className="fixed top-20 left-0 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto border border-gray-100">
                <ul className="space-y-2 font-medium">
                    <li>
                        <p>
                            <span className="ms-3 font-bold text-lg">Account Setting</span>
                        </p>
                    </li>
                    <li>
                        <NavLink to="/profile" className={`flex items-center p-2 rounded-lg group ${pathname === '/profile' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/availability" className={`flex items-center p-2 rounded-lg group ${pathname === '/availability' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Availability</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/billing_details" className={`flex items-center p-2 rounded-lg group ${pathname === '/billing_details' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Billing Details</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/invoice" className={`flex items-center p-2 rounded-lg group ${pathname === '/invoice' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Invoice</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/notifications" className={`flex items-center p-2 rounded-lg group ${pathname === '/notifications' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/privacysecurity" className={`flex items-center p-2 rounded-lg group ${pathname === '/privacysecurity' ? ' bg-gray-200' : 'text-gray-900'}`} >
                            <span className="flex-1 ms-3 whitespace-nowrap">Privacy & Security</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;