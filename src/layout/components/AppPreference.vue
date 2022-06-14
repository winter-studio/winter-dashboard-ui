<template>
  <n-drawer
    :show="show"
    :width="width"
    placement="right"
    @update:show="(value) => $emit('update:show', value)"
  >
    <n-drawer-content :title="title" :native-scrollbar="false">
      <div class="drawer">
        <n-divider title-placement="center">主题</n-divider>

        <div class="justify-center drawer-setting-item dark-switch">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-switch v-model:value="settingStore.darkTheme" class="dark-theme-switch">
                <template #checked>
                  <n-icon size="14" color="#ffd93b">
                    <sunny-sharp />
                  </n-icon>
                </template>
                <template #unchecked>
                  <n-icon size="14" color="#ffd93b">
                    <moon />
                  </n-icon>
                </template>
              </n-switch>
            </template>
            <span>{{ settingStore.darkTheme ? '深' : '浅' }}色主题</span>
          </n-tooltip>
        </div>

        <n-divider title-placement="center">系统主题</n-divider>

        <div class="drawer-setting-item align-items-top">
          <span
            v-for="(item, index) in appThemeList"
            :key="index"
            class="theme-item"
            :style="{ 'background-color': item }"
            @click="togTheme(item)"
          >
            <n-icon v-if="item === settingStore.appTheme" size="12">
              <check-outlined />
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">导航栏模式</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-dark.svg"
                  alt="左侧菜单模式"
                  @click="togNavMode('vertical')"
                />
              </template>
              <span>左侧菜单模式</span>
            </n-tooltip>
            <n-badge v-show="settingStore.navMode === 'vertical'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-horizontal.svg"
                  alt="顶部菜单模式"
                  @click="togNavMode('horizontal')"
                />
              </template>
              <span>顶部菜单模式</span>
            </n-tooltip>
            <n-badge v-show="settingStore.navMode === 'horizontal'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-horizontal-mix.svg"
                  alt="顶部菜单混合模式"
                  @click="togNavMode('horizontal-mix')"
                />
              </template>
              <span>顶部菜单混合模式</span>
            </n-tooltip>
            <n-badge v-show="settingStore.navMode === 'horizontal-mix'" dot color="#19be6b" />
          </div>
        </div>

        <n-divider title-placement="center">导航栏风格</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-dark.svg"
                  alt="暗色侧边栏"
                  @click="togNavTheme('dark')"
                />
              </template>
              <span>暗色侧边栏</span>
            </n-tooltip>
            <n-badge v-if="settingStore.navTheme === 'dark'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/nav-theme-light.svg"
                  alt="白色侧边栏"
                  @click="togNavTheme('light')"
                />
              </template>
              <span>白色侧边栏</span>
            </n-tooltip>
            <n-badge v-if="settingStore.navTheme === 'light'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img
                  src="~@/assets/images/header-theme-dark.svg"
                  alt="暗色顶栏"
                  @click="togNavTheme('header-dark')"
                />
              </template>
              <span>暗色顶栏</span>
            </n-tooltip>
            <n-badge v-if="settingStore.navTheme === 'header-dark'" dot color="#19be6b" />
          </div>
        </div>
        <n-divider title-placement="center">界面功能</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 分割菜单 </div>
          <div class="drawer-setting-item-action">
            <n-switch
              v-model:value="settingStore.menuSetting.mixMenu"
              :disabled="settingStore.navMode !== 'horizontal-mix'"
            />
          </div>
        </div>

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title"> 固定顶栏 </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.headerSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title">-->
        <!--            固定侧边栏-->
        <!--          </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.menuSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title"> 固定多页签 </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.multiTabsSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <n-divider title-placement="center">界面显示</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 显示重载页面按钮 </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.showHeaderReload" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 显示面包屑显示图标 </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.showCrumbIcon" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 显示多页签 </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.multiTabsEnabled" />
          </div>
        </div>

        <n-divider title-placement="center">动画</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 启用动画 </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.tabAnimationEnabled" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title"> 动画类型 </div>
          <div class="drawer-setting-item-select">
            <n-select v-model:value="settingStore.pageAnimateType" :options="animateOptions" />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, unref, watch, computed } from 'vue'
import { CheckOutlined } from '@vicons/antd'
import { Moon, SunnySharp } from '@vicons/ionicons5'
import { darkTheme } from 'naive-ui'
import { animates as animateOptions, appThemeList } from '@/settings/preference-values'
import { useAppPreferenceStore } from '@/store/modules/preference'

export default defineComponent({
  name: 'AppPreference',
  components: { CheckOutlined, Moon, SunnySharp },
  props: {
    title: {
      type: String,
      default: '个性配置'
    },
    width: {
      type: Number,
      default: 280
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:show'],
  setup(props) {
    const settingStore = useAppPreferenceStore()
    const state = reactive({
      width: props.width,
      title: props.title
    })

    watch(
      () => settingStore.darkTheme,
      (to) => {
        settingStore.navTheme = to ? 'header-dark' : 'light'
      }
    )

    const directionsOptions = computed(() => {
      return animateOptions.find((item) => item.value == unref(settingStore.pageAnimateType))
    })

    function togNavTheme(theme: string) {
      settingStore.navTheme = theme
      if (settingStore.navMode === 'horizontal' && ['light'].includes(theme)) {
        settingStore.navTheme = 'dark'
      }
    }

    function togTheme(color: string) {
      settingStore.appTheme = color
    }

    function togNavMode(mode: string) {
      settingStore.navMode = mode
      settingStore.menuSetting.mixMenu = false
    }

    return {
      ...toRefs(state),
      settingStore,
      togNavTheme,
      togNavMode,
      togTheme,
      darkTheme,
      animateOptions,
      directionsOptions,
      appThemeList
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer {
  .n-divider:not(.n-divider--vertical) {
    margin: 10px 0;
  }

  &-setting-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    flex-wrap: wrap;

    &-style {
      display: inline-block;
      position: relative;
      margin-right: 16px;
      cursor: pointer;
      text-align: center;
    }

    &-title {
      flex: 1 1;
      font-size: 14px;
    }

    &-action {
      flex: 0 0 auto;
    }

    &-select {
      flex: 1;
    }

    .theme-item {
      width: 20px;
      min-width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid #eee;
      border-radius: 2px;
      margin: 0 5px 5px 0;
      text-align: center;
      line-height: 14px;

      .n-icon {
        color: #fff;
      }
    }
  }

  .align-items-top {
    align-items: flex-start;
    padding: 2px 0;
  }

  .justify-center {
    justify-content: center;
  }

  .dark-switch .n-switch {
    ::v-deep(.n-switch__rail) {
      background-color: #000e1c;
    }
  }
}
</style>
