import { defineStore } from 'pinia'
import { FormSelectOption } from '@/types/component/form'
import { getRoleOptions } from '@/api/user/role'
import { DictItem } from '@/types/modules/dict'
import { getDictItems } from '@/api/basis/dict'

export enum DictCode {
  UserStatus = 'user_status'
}

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
  getters: {
    async getRoleOptions(state) {
      if (!state.roleOptions) {
        const { data } = await getRoleOptions()
        state.roleOptions = data
      }
      return state.roleOptions
    }
  },
  actions: {
    async getDictItems(code: DictCode) {
      if (!this.dicts.has(code)) {
        const { data } = await getDictItems(code)
        this.dicts.set(code, data!)
      }
      return this.dicts.get(code)
    }
  }
})
