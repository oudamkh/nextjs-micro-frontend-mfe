'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Settings, Users, FileText, Package, Shield, Database } from 'lucide-react';

// Sample data
const sampleMenuData = [
  {
    id: 1,
    code: "USER_MGMT",
    name_en: "User Management",
    name_kh: "ការគ្រប់គ្រងអ្នកប្រើប្រាស់",
    short_name_en: "Users",
    short_name_kh: "អ្នកប្រើ",
    description_en: "Manage users and permissions",
    description_kh: "គ្រប់គ្រងអ្នកប្រើប្រាស់និងការអនុញ្ញាត",
    icon: "users",
    href: "/user-management",
    order_sort: 1,
    items: [
      {
        id: "user-roles",
        code: "ROLES",
        name_en: "User Roles",
        name_kh: "តួនាទីអ្នកប្រើប្រាស់",
        href: "/user-management/roles",
        icon: "shield",
        show_badge: false,
        is_new: false,
        order_sort: 1,
        children: [
          {
            id: "role-list",
            code: "ROLE_LIST",
            name_en: "Role List",
            name_kh: "បញ្ជីតួនាទី",
            href: "/user-management/roles/list",
            icon: "fileText",
            show_badge: false,
            is_new: false,
            order_sort: 1,
            children: [],
            functions: []
          },
          {
            id: "role-permissions",
            code: "ROLE_PERM",
            name_en: "Role Permissions",
            name_kh: "សិទ្ធិតួនាទី",
            href: "/user-management/roles/permissions",
            icon: "fileText",
            show_badge: true,
            is_new: false,
            order_sort: 2,
            children: [],
            functions: []
          }
        ],
        functions: []
      },
      {
        id: "user-accounts",
        code: "ACCOUNTS",
        name_en: "User Accounts",
        name_kh: "គណនីអ្នកប្រើប្រាស់",
        href: "/user-management/accounts",
        icon: "users",
        show_badge: false,
        is_new: true,
        order_sort: 2,
        children: [
          {
            id: "account-list",
            code: "ACC_LIST",
            name_en: "Account List",
            name_kh: "បញ្ជីគណនី",
            href: "/user-management/accounts/list",
            icon: "fileText",
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
    code: "SYSTEM_CONFIG",
    name_en: "System Configuration",
    name_kh: "ការកំណត់ប្រព័ន្ធ",
    short_name_en: "Config",
    short_name_kh: "កំណត់",
    description_en: "Configure system settings",
    description_kh: "កំណត់ការកំណត់ប្រព័ន្ធ",
    icon: "settings",
    href: "/system-config",
    order_sort: 2,
    items: [
      {
        id: "general-settings",
        code: "GENERAL",
        name_en: "General Settings",
        name_kh: "ការកំណត់ទូទៅ",
        href: "/system-config/general",
        icon: "settings",
        show_badge: false,
        is_new: false,
        order_sort: 1,
        children: [],
        functions: []
      }
    ]
  }
];

const iconMap = {
  settings: Settings,
  users: Users,
  fileText: FileText,
  package: Package,
  shield: Shield,
  database: Database,
};

// Helper functions
const findItemByHref = (items, href) => {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children?.length > 0) {
      const found = findItemByHref(item.children, href);
      if (found) return found;
    }
  }
  return null;
};

const getParentIds = (items, targetId, parents = []) => {
  for (const item of items) {
    if (item.id === targetId) return parents;
    if (item.children?.length > 0) {
      const found = getParentIds(item.children, targetId, [...parents, item.id]);
      if (found.length > parents.length) return found;
    }
  }
  return [];
};

const expandParentsOfActiveItem = (menus, activeHref) => {
  const expandedSet = new Set();
  for (const menu of menus) {
    const activeItem = findItemByHref(menu.items, activeHref);
    if (activeItem) {
      const parents = getParentIds(menu.items, activeItem.id);
      parents.forEach(parentId => expandedSet.add(parentId));
      expandedSet.add(menu.id.toString());
    }
  }
  return expandedSet;
};

// Multi-Level Menu Component
const MultiLevelMenu = ({ menus, locale, onNavigate, renderIcon }) => {
  const [activeHref, setActiveHref] = React.useState('/user-management/roles/list');
  const [expandedItems, setExpandedItems] = React.useState(new Set());
  const [activeMenuId, setActiveMenuId] = React.useState(null);

  React.useEffect(() => {
    if (activeHref) {
      const expandedParents = expandParentsOfActiveItem(menus, activeHref);
      setExpandedItems(expandedParents);
      
      for (const menu of menus) {
        const activeItem = findItemByHref(menu.items, activeHref);
        if (activeItem) {
          setActiveMenuId(menu.id);
          break;
        }
      }
    }
  }, [activeHref, menus]);

  const toggleItem = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleNavigate = (href, item) => {
    setActiveHref(href);
    if (onNavigate) onNavigate(href, item);
  };

  const getDisplayName = (item) => {
    return locale === 'kh' ? item.name_kh : item.name_en;
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeHref === item.href;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center justify-between gap-2 px-4 py-2.5 cursor-pointer
            transition-all duration-200 rounded-lg group relative
            ${level === 0 ? 'text-gray-200' : 'text-gray-300'}
            ${isActive 
              ? 'bg-lime-500 text-gray-900 font-semibold shadow-lg shadow-lime-500/25' 
              : 'hover:bg-gray-700/50 hover:text-white'
            }
          `}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              handleNavigate(item.href, item);
            }
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {hasChildren && (
              <div className={`
                flex-shrink-0 w-5 h-5 border-2 border-dashed rounded-md flex items-center justify-center
                transition-colors duration-200
                ${isActive ? 'border-gray-800' : 'border-gray-500 group-hover:border-gray-400'}
              `}>
                <div className={`
                  w-2 h-2 rounded-sm transition-colors duration-200
                  ${isActive ? 'bg-gray-800' : 'bg-gray-500 group-hover:bg-gray-400'}
                `} />
              </div>
            )}
            
            {renderIcon && (
              <div className="flex-shrink-0">
                {renderIcon(item.icon, isActive)}
              </div>
            )}
            
            <span className="truncate text-sm tracking-wide">
              {getDisplayName(item)}
            </span>
            
            {item.is_new && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                NEW
              </span>
            )}
            
            {item.show_badge && (
              <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
          
          {hasChildren && (
            <div className={`
              flex-shrink-0 transition-all duration-200
              ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-200'}
            `}>
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
            {item.children
              .sort((a, b) => a.order_sort - b.order_sort)
              .map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const toggleMenu = (menuId) => {
    setActiveMenuId(prev => prev === menuId ? null : menuId);
  };

  return (
    <div className="space-y-4">
      {menus
        .sort((a, b) => a.order_sort - b.order_sort)
        .map((menu) => {
          const isMenuExpanded = activeMenuId === menu.id || expandedItems.has(menu.id.toString());
          const hasItems = menu.items && menu.items.length > 0;

          return (
            <div 
              key={menu.id} 
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleMenu(menu.id)}
                className="flex items-center gap-3 w-full p-6 group hover:bg-gray-800/30 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-gray-500 transition-colors">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors" />
                </div>
                
                {renderIcon && (
                  <div className="flex-shrink-0">
                    {renderIcon(menu.icon, false)}
                  </div>
                )}
                
                <h2 className="text-lg font-semibold text-gray-200 tracking-tight group-hover:text-white transition-colors flex-1 text-left">
                  {getDisplayName(menu)}
                </h2>
                
                {hasItems && (
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-200 transition-all duration-200">
                    {isMenuExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                )}
              </button>

              {hasItems && isMenuExpanded && (
                <div className="px-4 pb-4 space-y-1">
                  {menu.items
                    .sort((a, b) => a.order_sort - b.order_sort)
                    .map((item) => renderMenuItem(item))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeNav, setActiveNav] = useState('System');
  const [locale, setLocale] = useState('en');

  const navItems = [
    { id: '1', icon: <Users className="w-6 h-6" />, label: 'Account', code: 'Account' },
    { id: '2', icon: <Settings className="w-6 h-6" />, label: 'Configs', code: 'Configs' },
    { id: '3', icon: <Package className="w-6 h-6" />, label: 'Product', code: 'Product' },
    { id: '4', icon: <Settings className="w-6 h-6" />, label: 'System', code: 'System' },
    { id: '5', icon: <FileText className="w-6 h-6" />, label: 'Requests', code: 'Requests' },
  ];

  const renderIcon = (iconName, isActive) => {
    const Icon = iconMap[iconName] || Settings;
    return (
      <Icon 
        className={`w-5 h-5 transition-all duration-200 ${
          isActive 
            ? 'text-gray-900' 
            : 'text-gray-400 group-hover:text-gray-200'
        }`} 
      />
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Main Navigation Sidebar */}
      <div className="w-28 bg-black/60 backdrop-blur-xl border-r border-gray-800/50 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-800/50">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/5">
            <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg" />
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
          {navItems.map((nav) => {
            const isActive = activeNav === nav.code;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveNav(nav.code)}
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
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {nav.icon}
                </div>
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

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">System Management</h2>
                <p className="text-gray-400">Configure and manage system settings</p>
              </div>
              <button
                onClick={() => setLocale(locale === 'en' ? 'kh' : 'en')}
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-200 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {locale === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
              </button>
            </div>

            <MultiLevelMenu
              menus={sampleMenuData}
              locale={locale}
              renderIcon={renderIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
