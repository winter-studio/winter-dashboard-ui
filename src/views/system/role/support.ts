import { SearchItem } from '@/types/component/table'
import { FormRules } from 'naive-ui/es/form/src/interface'
import { FormItemRule } from 'naive-ui'
import { isEmpty } from 'lodash-es'

export type SearchParam = {
  roleName: string
  roleCode: string
}

export type RoleFormModel = {
  id?: number
  roleName: string
  roleCode: string
}

export const searchItems: SearchItem[] = [
  {
    label: 'views.role.roleName',
    path: 'roleName',
    placeholder: 'views.role.roleNamePlaceholder',
    labelWidth: 100
  },
  {
    label: 'views.role.roleCode',
    path: 'roleCode',
    placeholder: 'views.role.roleCodePlaceholder',
    labelWidth: 100
  }
]

export const formRules: FormRules = {
  roleCode: [
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
  roleName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 30, message: '昵称只能30个字符内', trigger: 'blur' }
  ]
}
