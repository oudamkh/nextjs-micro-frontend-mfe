'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface MenuFunction {
  id: string;
  code: string;
  name: string;
  [key: string]: any;
}

export interface MenuItem {
  id: string;
  code: string;
  name_en: string;
  name_kh: string;
  href: string;
  icon: string;
  show_badge?: boolean;
  is_new?: boolean;
  order_sort: number;
  children: MenuItem[];
  functions: MenuFunction[];
}

export interface Menu {
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

export interface SidebarConfig {
  onNavigate?: (href: string, item: MenuItem) => void;
  renderIcon?: (iconName: string, isActive: boolean) => React.ReactNode;
  className?: string;
  locale?: 'en' | 'kh';
  enableRouterIntegration?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Find an item by href in the menu tree
 */
const findItemByHref = (items: MenuItem[], href: string): MenuItem | null => {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children?.length > 0) {
      const found = findItemByHref(item.children, href);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get all parent IDs for a given item
 */
const getParentIds = (items: MenuItem[], targetId: string, parents: string[] = []): string[] => {
  for (const item of items) {
    if (item.id === targetId) {
      return parents;
    }
    if (item.children?.length > 0) {
      const found = getParentIds(item.children, targetId, [...parents, item.id]);
      if (found.length > parents.length) {
        return found;
      }
    }
  }
  return [];
};

/**
 * Expand all parents of the active item
 */
const expandParentsOfActiveItem = (menus: Menu[], activeHref: string): Set<string> => {
  const expandedSet = new Set<string>();
  
  for (const menu of menus) {
    const activeItem = findItemByHref(menu.items, activeHref);
    if (activeItem) {
      const parents = getParentIds(menu.items, activeItem.id);
      parents.forEach(parentId => expandedSet.add(parentId));
      // Also expand the active menu
      expandedSet.add(menu.id.toString());
    }
  }
  
  return expandedSet;
};

// ============================================================================
// Main Component
// ============================================================================

export interface MultiLevelSidebarProps {
  menus: Menu[];
  config?: SidebarConfig;
}

export const MultiLevelSidebar: React.FC<MultiLevelSidebarProps> = ({ 
  menus, 
  config = {} 
}) => {
  const {
    onNavigate,
    renderIcon,
    className = '',
    locale = 'en',
    enableRouterIntegration = true,
  } = config;

  // Next.js router integration (optional)
  const pathname = enableRouterIntegration ? usePathname() : null;
  const router = enableRouterIntegration ? useRouter() : null;

  // State management
  const [activeHref, setActiveHref] = useState<string>(pathname || '');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Update active href when pathname changes
  useEffect(() => {
    if (pathname) {
      setActiveHref(pathname);
    }
  }, [pathname]);

  // Auto-expand parents of active item on mount and when active href changes
  useEffect(() => {
    if (activeHref) {
      const expandedParents = expandParentsOfActiveItem(menus, activeHref);
      setExpandedItems(expandedParents);
      
      // Set active menu
      for (const menu of menus) {
        const activeItem = findItemByHref(menu.items, activeHref);
        if (activeItem) {
          setActiveMenuId(menu.id);
          break;
        }
      }
    }
  }, [activeHref, menus]);

  // Toggle item expansion
  const toggleItem = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((href: string, item: MenuItem) => {
    setActiveHref(href);
    
    if (onNavigate) {
      onNavigate(href, item);
    } else if (router) {
      router.push(href);
    }
  }, [onNavigate, router]);

  // Get display name based on locale
  const getDisplayName = (item: MenuItem | Menu) => {
    return locale === 'kh' ? item.name_kh : item.name_en;
  };

  // Render menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
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
          <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children
              .sort((a, b) => a.order_sort - b.order_sort)
              .map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Toggle menu expansion
  const toggleMenu = (menuId: number) => {
    setActiveMenuId(prev => prev === menuId ? null : menuId);
  };

  return (
    <div className={`w-full ${className}`}>
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
                  <div className="px-4 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {menu.items
                      .sort((a, b) => a.order_sort - b.order_sort)
                      .map((item) => renderMenuItem(item))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MultiLevelSidebar;
