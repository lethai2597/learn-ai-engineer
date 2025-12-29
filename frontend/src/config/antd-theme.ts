import type { ThemeConfig } from "antd";

/**
 * Ant Design Theme Configuration
 * Modern Minimal Design
 */
export const antdTheme: ThemeConfig = {
  token: {
    // Border radius
    borderRadius: 8, // Base: 8px
    borderRadiusLG: 12, // Large: 12px
    borderRadiusOuter: 16, // Outer: 16px
    borderRadiusSM: 6, // Small: 6px

    // Colors - Subtle, professional
    colorPrimary: '#3b82f6', // Blue-500
    colorSuccess: '#10b981', // Green-500
    colorWarning: '#f59e0b', // Orange-500
    colorError: '#ef4444', // Red-500
    colorInfo: '#06b6d4', // Cyan-500

    // Typography
    fontFamily: 'var(--font-be-vietnam-pro), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,

    // Shadows - Subtle
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    boxShadowSecondary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

    // Border
    colorBorder: '#e5e7eb', // gray-200
  },
  components: {
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 4,
      itemMarginBlock: 2,
      subMenuItemBorderRadius: 6,
      itemHoverBg: '#f3f4f6', // gray-100
      itemSelectedBg: '#eff6ff', // blue-50
      itemSelectedColor: '#3b82f6', // blue-600
      itemHoverColor: '#1f2937', // gray-800
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Tabs: {
      borderRadius: 8,
      itemSelectedColor: '#3b82f6',
      inkBarColor: '#3b82f6',
    },
  },
};



