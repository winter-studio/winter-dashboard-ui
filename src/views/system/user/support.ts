import { SearchItem } from '@/types/component/table'
import { FormRules } from 'naive-ui/es/form/src/interface'
import { FormItemRule } from 'naive-ui'
import { isEmpty } from 'lodash-es'

export type SearchParam = {
  username: string
  mobile: string
  nickname: string
}

export type UserFormModel = {
  id?: number
  avatar?: string
  username: string
  nickname: string
  password?: string
  mobile?: string
  status: string
  roles: string[]
}

export const searchItems: SearchItem[] = [
  {
    label: 'views.user.criteria.username',
    path: 'username',
    placeholder: 'views.user.criteria.usernamePlaceholder',
    labelWidth: 100
  },
  {
    label: 'views.user.criteria.nickname',
    path: 'nickname',
    placeholder: 'views.user.criteria.nicknamePlaceholder',
    labelWidth: 100
  },
  {
    label: 'views.user.criteria.tel',
    path: 'mobile',
    placeholder: 'views.user.criteria.telPlaceholder',
    labelWidth: 100
  }
]

export const userFormRules: FormRules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      validator(_: FormItemRule, value: string) {
        if (isEmpty(value)) {
          return new Error('请输入用户名')
        }

        if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
          return new Error('用户名只能由4-16位字母、数字、下划线组成')
        }
        return true
      }
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称只能20个字符内', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入正确的手机号', trigger: 'blur', pattern: /^1\d{10}$/ }
  ],
  password: [
    {
      message: '密码只能由6-32位字母、数字、下划线组成',
      trigger: 'blur',
      pattern: /^[a-zA-Z0-9_]{6,32}$/
    }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  roles: [{ type: 'array', required: true, message: '请分配角色', trigger: ['blur', 'change'] }]
}
