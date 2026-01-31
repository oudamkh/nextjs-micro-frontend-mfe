'use client';

import React, { useState } from 'react';
import { Settings, Users, FileText, Package, Shield, Database, Bell } from 'lucide-react';
import { MultiLevelSidebar, Menu } from './MultiLevelSidebar';

/**
 * Complete example showing all features of the MultiLevelSidebar component
 */

// Icon mapping for the sidebar
const iconMap: Record<string, React.ComponentType<any>> = {
  settings: Settings,
  users: Users,
  fileText: FileText,
  package: Package,
  shield: Shield,
  database: Database,
  bell: Bell,
};

// Sample menu data with all features demonstrated
const sampleMenuData: Menu[] = [
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
            show_badge: true, // Badge indicator
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
        is_new: true, // "NEW" badge
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
          },
          {
            id: "account-pending",
            code: "ACC_PENDING",
            name_en: "Pending Approval",
            name_kh: "រង់ចាំការអនុម័ត",
            href: "/user-management/accounts/pending",
            icon: "fileText",
            show_badge: true,
            is_new: false,
            order_sort: 2,
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
      },
      {
        id: "database-settings",
        code: "DATABASE",
        name_en: "Database Settings",
        name_kh: "ការកំណត់មូលដ្ឋានទិន្នន័យ",
        href: "/system-config/database",
        icon: "database",
        show_badge: false,
        is_new: false,
        order_sort: 2,
        children: [],
        functions: []
      }
    ]
  },
  {
    id: 3,
    code: "NOTIFICATIONS",
    name_en: "Notifications",
    name_kh: "ការជូនដំណឹង",
    short_name_en: "Notifications",
    short_name_kh: "ដំណឹង",
    description_en: "Manage notifications",
    description_kh: "គ្រប់គ្រងការជូនដំណឹង",
    icon: "bell",
    href: "/notifications",
    order_sort: 3,
    items: [] // Empty menu to demonstrate that too
  }
];

export default function CompleteExample() {
  const [locale, setLocale] = useState<'en' | 'kh'>('en');
  const [navigationLog, setNavigationLog] = useState<string[]>([]);

  // Custom navigation handler with logging
  const handleNavigate = (href: string, item: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] Navigated to: ${href} (${item.name_en})`;
    setNavigationLog(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10
    
    // In a real app, you might do:
    // router.push(href);
    // trackAnalytics('navigation', { path: href });
  };

  // Custom icon renderer
  const renderIcon = (iconName: string, isActive: boolean) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Multi-Level Sidebar - Complete Example
          </h1>
          <p className="text-gray-400">
            Demonstrating all features: auto-expand, active state, badges, new indicators, custom icons, and multi-language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Navigation Menu
                </h2>
                
                {/* Language Switcher */}
                <button
                  onClick={() => setLocale(locale === 'en' ? 'kh' : 'en')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  {locale === 'en' ? '🇰🇭 Switch to Khmer' : '🇬🇧 Switch to English'}
                </button>
              </div>

              <MultiLevelSidebar
                menus={sampleMenuData}
                config={{
                  onNavigate: handleNavigate,
                  renderIcon,
                  locale,
                  enableRouterIntegration: false, // Using custom handler
                }}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                ✨ Features Demonstrated
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Auto-expanding active paths</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Active state highlighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Badge indicators (red dots)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>"NEW" labels for new items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Custom icon rendering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Multi-language support (EN/KH)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Custom navigation handler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▶</span>
                  <span>Nested menu levels (unlimited)</span>
                </li>
              </ul>
            </div>

            {/* Navigation Log */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                📋 Navigation Log
              </h3>
              {navigationLog.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Click any menu item to see navigation events...
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {navigationLog.map((log, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono text-gray-300 bg-gray-800/50 rounded p-2 border border-gray-700/50"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-lime-500/10 to-lime-600/10 backdrop-blur-sm rounded-2xl border border-lime-500/20 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                💡 Try This
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Click any nested item to see auto-expand</li>
                <li>• Toggle language to see translations</li>
                <li>• Look for red badge dots on some items</li>
                <li>• Notice "NEW" labels on recent features</li>
                <li>• Check the navigation log for events</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            📝 Code Usage
          </h3>
          <pre className="text-sm font-mono text-gray-300 bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
{`import { MultiLevelSidebar } from '@/components/MultiLevelSidebar';
import { Settings, Users } from 'lucide-react';

const iconMap = { settings: Settings, users: Users };

export default function App() {
  return (
    <MultiLevelSidebar
      menus={menuData}
      config={{
        onNavigate: (href, item) => {
          console.log('Navigate to:', href);
        },
        renderIcon: (iconName, isActive) => {
          const Icon = iconMap[iconName];
          return <Icon className="w-5 h-5" />;
        },
        locale: 'en',
        enableRouterIntegration: true
      }}
    />
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
