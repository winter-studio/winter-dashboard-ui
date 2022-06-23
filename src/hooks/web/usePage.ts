import type { RouteLocationRaw, Router } from 'vue-router'

import { RouteNames } from '@/router/base'

import { useRouter } from 'vue-router'
import { isString } from 'lodash-es'

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: RouteNames }

function handleError(e: Error) {
  console.error(e)
}

/**
 * 页面切换
 */
export function useGo(_router?: Router) {
  const router = _router ?? useRouter()
  const { push, replace } = router
  function go(
    opt: RouteNames | RouteLocationRawEx | string = RouteNames.BASE_HOME,
    isReplace = false
  ) {
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
