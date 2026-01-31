'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Type definitions based on your data structure
interface MenuFunction {
  // Add function properties as needed
}

interface MenuItem {
  id: string;
  code: string;
  name_en: string;
  name_kh: string;
  href: string;
  icon: string;
  show_badge: boolean;
  is_new: boolean;
  order_sort: number;
  children: MenuItem[];
  functions: MenuFunction[];
}

interface Menu {
  id: number;
  code: string;
  name_en: string;
  name_kh: string;
  short_name_en: string;
  short_name_kh: string;
  description_en: string;
  description_kh: string;
  icon: string;
  href: string;
  order_sort: number;
  items: MenuItem[];
}

interface MultiLevelSidebarProps {
  menus: Menu[];
}

const MultiLevelSidebar: React.FC<MultiLevelSidebarProps> = ({ menus }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center justify-between gap-2 px-4 py-2.5 cursor-pointer
            transition-all duration-200 rounded-lg
            ${level === 0 ? 'text-gray-200' : 'text-gray-300'}
            ${isActive ? 'bg-lime-500 text-gray-900 font-medium' : 'hover:bg-gray-700/50'}
          `}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              setActiveItem(item.id);
            }
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {hasChildren && (
              <div className="flex-shrink-0 w-5 h-5 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
              </div>
            )}
            <span className="truncate text-sm">{item.name_en}</span>
          </div>
          
          {hasChildren && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Main Navigation Sidebar */}
      <div className="w-28 bg-black/40 backdrop-blur-sm border-r border-gray-800/50 flex flex-col">
        <div className="p-4 border-b border-gray-800/50">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-md" />
          </div>
        </div>

        <nav className="flex-1 py-4">
          {[
            { icon: '👤', label: 'Account' },
            { icon: '🔧', label: 'Configs' },
            { icon: '📦', label: 'Product' },
            { icon: '⚙️', label: 'System', active: true },
            { icon: '📄', label: 'Requests' },
          ].map((nav, idx) => (
            <button
              key={idx}
              className={`
                w-full px-4 py-4 flex flex-col items-center gap-2 
                transition-all duration-200 relative group
                ${nav.active 
                  ? 'text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-lime-500' 
                  : 'text-gray-400 hover:text-gray-200'
                }
              `}
            >
              <span className="text-2xl">{nav.icon}</span>
              <span className="text-xs font-medium">{nav.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-900 rounded" />
            </div>
            <h1 className="text-xl font-semibold text-gray-100">Management Console</h1>
          </div>
          
          <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-300">
            🔍
          </button>
        </header>

        {/* Main Content with Nested Menu */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl">
            {/* System Role Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-sm" />
                </div>
                <h2 className="text-lg font-medium text-gray-200">System Role</h2>
                <button className="ml-auto">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2 ml-2">
                <button className="w-full px-6 py-3 bg-lime-500 hover:bg-lime-400 text-gray-900 font-medium rounded-lg transition-colors text-left">
                  List
                </button>
                <button className="w-full px-6 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                  Pending Approval
                </button>
              </div>
            </div>

            {/* System Users Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-sm" />
                </div>
                <h2 className="text-lg font-medium text-gray-200">System Users</h2>
              </div>
            </div>

            {/* Dynamic Menu Items from Props */}
            {menus.map((menu) => (
              <div key={menu.id} className="mb-6">
                <button
                  onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                  className="flex items-center gap-3 w-full mb-3 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-sm" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-200">{menu.name_en}</h2>
                  <div className="ml-auto">
                    {activeMenu === menu.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {activeMenu === menu.id && menu.items.length > 0 && (
                  <div className="space-y-1 ml-2">
                    {menu.items.map((item) => renderMenuItem(item))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLevelSidebar;
