import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Settings, Users, FileText, Package, User } from 'lucide-react';

const sampleMenuData = {
  menus: [
    {
      id: 1,
      code: "DEMO",
      name_en: "DEMO Management",
      name_kh: "DEMO Management",
      short_name_en: "DEMO",
      short_name_kh: "DEMO",
      description_en: "DEMO",
      description_kh: "DEMO",
      icon: "settings",
      href: "/demo-management/components/tabs/basic",
      order_sort: 1,
      items: [
        {
          id: "tabs",
          code: "TB",
          name_en: "Tabs",
          name_kh: "Tabs",
          href: "/demo-management/components/tabs/basic",
          icon: "settings",
          show_badge: false,
          is_new: false,
          order_sort: 1,
          children: [
            {
              id: "tabs_basic",
              code: "Basic Tab",
              name_en: "Basic Tab",
              name_kh: "មើលគណនី",
              href: "/demo-management/components/tabs/basic",
              icon: "account",
              show_badge: false,
              is_new: false,
              order_sort: 1,
              children: [],
              functions: []
            },
            {
              id: "tabs_dynamic",
              code: "tabs_dynamic",
              name_en: "Dynamic Tab",
              name_kh: "Dynamic Tab",
              href: "/demo-management/components/tabs/dynamic",
              icon: "account",
              show_badge: false,
              is_new: false,
              order_sort: 1,
              children: [],
              functions: []
            }
          ],
          functions: []
        }
      ]
    },
    {
      id: 2,
      code: "CONFIG",
      name_en: "Config Management",
      name_kh: "Config Management",
      short_name_en: "Config",
      short_name_kh: "Config",
      description_en: "Manage configuration for applications",
      description_kh: "Manage configuration for applications",
      icon: "settings",
      href: "/config-management",
      order_sort: 1,
      items: []
    }
  ]
};

const MultiLevelSidebar = ({ menus }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [activeItem, setActiveItem] = useState('tabs_basic');
  const [activeNav, setActiveNav] = useState('System');

  const toggleItem = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center justify-between gap-2 px-4 py-2.5 cursor-pointer
            transition-all duration-200 rounded-lg group
            ${level === 0 ? 'text-gray-200' : 'text-gray-300'}
            ${isActive ? 'bg-lime-500 text-gray-900 font-medium shadow-lg shadow-lime-500/20' : 'hover:bg-gray-700/50'}
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
            <span className="truncate text-sm tracking-wide">{item.name_en}</span>
          </div>
          
          {hasChildren && (
            <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const navItems = [
    { icon: User, label: 'Account' },
    { icon: Settings, label: 'Configs' },
    { icon: Package, label: 'Product' },
    { icon: Settings, label: 'System', active: true },
    { icon: FileText, label: 'Requests' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Main Navigation Sidebar */}
      <div className="w-28 bg-black/60 backdrop-blur-xl border-r border-gray-800/50 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-800/50">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/5">
            <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg" />
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {navItems.map((nav, idx) => {
            const IconComponent = nav.icon;
            const isActive = activeNav === nav.label;
            return (
              <button
                key={idx}
                onClick={() => setActiveNav(nav.label)}
                className={`
                  w-full px-4 py-4 flex flex-col items-center gap-2 
                  transition-all duration-300 relative group
                  ${isActive
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-gray-200'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-lime-400 to-lime-600 rounded-r-full shadow-lg shadow-lime-500/50" />
                )}
                <IconComponent className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="text-xs font-medium tracking-wide">{nav.label}</span>
                {isActive && <div className="absolute inset-0 bg-gray-800/30 rounded-lg -z-10" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-md ring-1 ring-white/5">
              <div className="w-5 h-5 bg-gradient-to-br from-lime-400 to-lime-600 rounded-md" />
            </div>
            <h1 className="text-xl font-semibold text-gray-100 tracking-tight">Management Console</h1>
          </div>
          
          <button className="w-10 h-10 rounded-xl bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 flex items-center justify-center text-gray-300 hover:text-white shadow-md hover:shadow-lg ring-1 ring-white/5">
            <Search className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content with Nested Menu */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl space-y-6">
            {/* System Role Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm" />
                </div>
                <h2 className="text-lg font-semibold text-gray-200 tracking-tight">System Role</h2>
                <button className="ml-auto text-gray-400 hover:text-gray-200 transition-colors">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <button className="w-full px-6 py-3.5 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-gray-900 font-semibold rounded-xl transition-all duration-200 text-left shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 hover:scale-[1.02]">
                  List
                </button>
                <button className="w-full px-6 py-3.5 text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-200 text-left hover:text-white">
                  Pending Approval
                </button>
              </div>
            </div>

            {/* System Users Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm" />
                </div>
                <h2 className="text-lg font-semibold text-gray-200 tracking-tight">System Users</h2>
              </div>
            </div>

            {/* Dynamic Menu Items from Props */}
            {menus.map((menu) => (
              <div key={menu.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl">
                <button
                  onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                  className="flex items-center gap-3 w-full mb-4 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-gray-500 transition-colors">
                    <div className="w-3 h-3 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-200 tracking-tight group-hover:text-white transition-colors">{menu.name_en}</h2>
                  <div className="ml-auto text-gray-400 group-hover:text-gray-200 transition-colors">
                    {activeMenu === menu.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {activeMenu === menu.id && menu.items.length > 0 && (
                  <div className="space-y-1">
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

export default function App() {
  return <MultiLevelSidebar menus={sampleMenuData.menus} />;
}
