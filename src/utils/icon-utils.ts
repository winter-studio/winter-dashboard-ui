import { Component, h } from 'vue'
import { NIcon } from 'naive-ui'
import IconRender from '@/components/menu/IconRender.vue'

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export function renderMenuIcon(name: string) {
  return () => h(IconRender, { icon: name }, {})
}
