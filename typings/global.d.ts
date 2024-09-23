import 'vite/client'
import type {
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType
} from 'vue'
import { LoadingBarProviderInst } from 'naive-ui/lib/loading-bar/src/LoadingBarProvider'
import { MessageProviderInst } from 'naive-ui/lib/message/src/MessageProvider'
import { DialogProviderInst } from 'naive-ui/lib/dialog/src/DialogProvider'
import { Composer } from 'vue-i18n'

declare global {
  interface Window {
    $loading: LoadingBarProviderInst
    $message: MessageProviderInst
    $dialog: DialogProviderInst
    $i18n: Composer
  }

  // vue
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type Indexable<T = any> = {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  declare interface WheelEvent {
    path?: EventTarget[]
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  declare interface ViteEnv {
    VITE_PUBLIC_PATH: string
    VITE_APP_TITLE: string
    VITE_APP_SHORT_NAME: string
    VITE_APP_API_URL: string
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}

declare module 'naive-ui' {
  export interface CustomThemeCommonVars {
    appTabsBgColor: string
    appTabContentBgColor: string
    appTabsBgColorPreActive: string
    appTabsBgColorActive: string
    layoutContentBgColor: string
    loginBgColor: string
  }
}
