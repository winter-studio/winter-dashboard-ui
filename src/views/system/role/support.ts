import { SearchItem } from '@/types/component/table'
import { FormRules } from 'naive-ui/es/form/src/interface'
import { FormItemRule } from 'naive-ui'
import { isEmpty } from 'lodash-es'

export type SearchParam = {
  name: string
  code: string
}

export type RoleFormModel = {
  id?: number
  name: string
  code: string
}

export const searchItems: SearchItem[] = [
  {
    label: 'views.role.roleName',
    path: 'name',
    placeholder: 'views.role.roleNamePlaceholder',
    labelWidth: 100
  },
  {
    label: 'views.role.roleCode',
    path: 'code',
    placeholder: 'views.role.roleCodePlaceholder',
    labelWidth: 100
  }
]

export const formRules: FormRules = {
  code: [
    {
      required: true,
      trigger: 'blur',
      validator(_: FormItemRule, value: string) {
        if (isEmpty(value)) {
          return new Error('请输入角色代码')
        }

        if (!/^[a-zA-Z0-9_]{2,16}$/.test(value)) {
          return new Error('角色代码只能由2-16位字母、数字、下划线组成')
        }
        return true
      }
    }
  ],
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 30, message: '角色名称应在30个字符内', trigger: 'blur' }
  ]
}
