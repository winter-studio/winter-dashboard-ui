import { defineStore } from 'pinia'
import { FormSelectOption } from '@/types/component/form'
import { getRoleOptions } from '@/api/user/role'

export interface DictState {
  roleOptions?: FormSelectOption[]
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    roleOptions: undefined
  }),
  getters: {},
  actions: {
    load(key: 'roles') {
      switch (key) {
        case 'roles':
          if (this.roleOptions) return
          getRoleOptions().then((res) => (this.roleOptions = res.data!))
          break
      }
    }
  }
})
