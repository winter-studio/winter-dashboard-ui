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
  pendingRequests: Map<string, Promise<DictItem[]>>
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    roleOptions: undefined,
    dictMap: new Map<string, DictItem[]>(),
    pendingRequests: new Map<string, Promise<DictItem[]>>()
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
    // 获取字典项，优先从缓存中获取，否则发起请求
    async getDictItems(code: DictCode): Promise<DictItem[]> {
      // 先检查 dictMap 中是否已经有缓存的字典项
      if (this.dictMap.has(code)) {
        return this.dictMap.get(code)!
      }

      // 如果没有缓存，检查是否有正在进行的请求
      if (this.pendingRequests.has(code)) {
        // 如果有请求正在进行，等待请求完成
        return this.pendingRequests.get(code)!
      }

      // 如果没有请求进行中，发起请求并保存 Promise
      const requestPromise = getDictItems(code)
        .then(({ data }) => {
          // 请求完成后将结果存入 dictMap
          this.dictMap.set(code, data)
          // 请求完成后移除 pendingRequests 中的记录
          this.pendingRequests.delete(code)
          return data
        })
        .catch((error) => {
          // 请求失败时也要从 pendingRequests 中移除
          this.pendingRequests.delete(code)
          throw error
        })

      // 将请求保存到 pendingRequests 中
      this.pendingRequests.set(code, requestPromise)

      // 返回请求的结果
      return await requestPromise
    }
  }
})
