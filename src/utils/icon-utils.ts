import { Component, h } from 'vue'
import { NIcon } from 'naive-ui'
import {
  ProjectOutlined,
  WalletOutlined,
  DashboardOutlined,
  ProfileOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
  CheckCircleOutlined,
  SettingOutlined
} from '@vicons/antd'
import { DocumentTextOutline, DesktopOutline, OptionsSharp } from '@vicons/ionicons5'

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const menuIcons: { [key: string]: Component } = {
  ProjectOutlined,
  WalletOutlined,
  DashboardOutlined,
  DocumentTextOutline,
  ProfileOutlined,
  ExclamationCircleOutlined,
  DesktopOutline,
  TableOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  OptionsSharp
}

export function renderIconByName(name: string) {
  return renderIcon(menuIcons[name])
}
