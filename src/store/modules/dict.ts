import { defineStore } from 'pinia'
import { FormSelectOption } from '@/types/component/form'
import { getRoleOptions } from '@/api/user/role'
import { DictItem } from '@/types/modules/dict'

export interface DictState {
  roleOptions?: FormSelectOption[]
  dicts: Map<string, DictItem[]>
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    roleOptions: undefined,
    dicts: new Map<string, DictItem[]>()
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
    },
    getDict(code: string) {
      if (this.dicts.has(code)) {
        //TODO
        return this.dicts.get(code)
      }
    }
  }
})
