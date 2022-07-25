import { defineStore } from 'pinia'
import { FormSelectOption } from '@/types/component/form'
import { getRoleOptions } from '@/api/role'
import { DictItem } from '@/types/modules/dict'
import { getDictItems } from '@/api/dict'

export enum DictCode {
  UserStatus = 'user_status'
}

export type Dict = Map<string, string>

export interface DictState {
  roleOptions?: FormSelectOption[]
  dictMap: Map<string, DictItem[]>
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    roleOptions: undefined,
    dictMap: new Map<string, DictItem[]>()
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
    async init(...codes: DictCode[]) {
      await Promise.all(
        codes.map(async (code) => {
          if (this.dictMap.has(code)) {
            return
          }
          const { data } = await getDictItems(code)
          this.dictMap.set(code, data!)
        })
      )
    },
    getDictItems(code: DictCode) {
      return this.dictMap.get(code) || []
    },
    getDict(code: DictCode): Dict {
      const dictItems = this.dictMap.get(code)
      const dict = new Map<string, string>()
      dictItems!.forEach((item: DictItem) => {
        dict.set(item.key, item.value)
      })
      return dict
    },
    getDictValue(dictType: DictCode, key?: string) {
      if (!key) {
        return undefined
      }
      const dict = this.getDict(dictType)
      return dict.get(key) || ''
    },
    getDictKeyFromValue(dictType: DictCode, value: string) {
      const dict = this.getDict(dictType)
      for (const dictKey in dict) {
        if (dict.get(dictKey) === value) {
          return dictKey
        }
      }
    }
  }
})
