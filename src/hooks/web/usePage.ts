import type { RouteLocationRaw, Router } from 'vue-router'

import { PageEnum } from '@/enums/pageEnum'

import { useRouter } from 'vue-router'
import { isString } from '@/utils/is'

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: PageEnum }

function handleError(e: Error) {
  console.error(e)
}

/**
 * 页面切换
 */
export function useGo(_router?: Router) {
  const router = _router ?? useRouter()
  const { push, replace } = router
  function go(opt: PageEnum | RouteLocationRawEx | string = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt) {
      return
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
    } else {
      const o = opt as RouteLocationRaw
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError)
    }
  }
  return go
}
