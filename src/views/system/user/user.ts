import { SearchItem } from '@/types/component/table'
import { ref } from 'vue'
import { FormRules } from 'naive-ui/es/form/src/interface'

export type SearchParam = {
  username: string
  mobile: string
  nickname: string
}

export type UserForm = {
  username: string
  nickname: string
  mobile: string
  roles: string[]
}

export const searchItems: SearchItem[] = [
  {
    label: '用户名',
    path: 'username',
    placeholder: '用户名搜索'
  },
  {
    label: '昵称',
    path: 'nickname',
    placeholder: '昵称搜索'
  },
  {
    label: '手机号',
    path: 'mobile',
    placeholder: '手机号搜索'
  }
]

export const userFormRules = ref<FormRules>({})
