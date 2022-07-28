<template>
  <n-drawer :show="show" :width="280" placement="right" @update:show="updateShow">
    <n-drawer-content title="个性配置" :native-scrollbar="false">
      <div class="drawer">
        <section class="mb-4">
          <n-divider title-placement="center">主题</n-divider>
          <div class="flex justify-center dark-switch">
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
        </section>

        <section class="mb-4">
          <n-divider title-placement="center">系统主题</n-divider>
          <div class="flex flex-wrap">
            <div
              v-for="(item, index) in AppThemeList"
              :key="index"
              class="color-block"
              :style="{ 'background-color': item }"
              @click="togTheme(item)"
            >
              <n-icon v-if="item === settingStore.appTheme" color="white" size="18">
                <check-outlined />
              </n-icon>
            </div>
          </div>
        </section>

        <section class="mb-4">
          <n-divider title-placement="center">导航栏模式</n-divider>
          <div class="flex justify-between">
            <div class="flex flex-col items-center">
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

            <div class="flex flex-col items-center">
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

            <div class="flex flex-col items-center">
              <n-tooltip placement="top">
                <template #trigger>
                  <img
                    src="~@/assets/images/nav-horizontal-mix.svg"
                    alt="顶部菜单混合模式"
                    @click="togNavMode('horizontal-mix', true)"
                  />
                </template>
                <span>顶部菜单混合模式</span>
              </n-tooltip>
              <n-badge v-show="settingStore.navMode === 'horizontal-mix'" dot color="#19be6b" />
            </div>
          </div>
        </section>
        <section class="mb-4">
          <n-divider title-placement="center">导航栏风格</n-divider>

          <div class="flex justify-between">
            <div class="flex flex-col items-center">
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

            <div class="flex flex-col items-center">
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

            <div class="flex flex-col items-center">
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
        </section>

        <section class="mb-4">
          <n-divider title-placement="center">界面功能</n-divider>

          <div class="flex justify-between">
            <div class="text-sm"> 分割菜单</div>
            <div>
              <n-switch
                v-model:value="settingStore.menuSetting.mixMenu"
                :disabled="settingStore.navMode !== 'horizontal-mix'"
              />
            </div>
          </div>

          <!--        <div class="flex justify-between">
            <div class="text-sm"> 固定顶栏 </div>
            <n-switch v-model:value="settingStore.headerSetting.fixed" />
          </div>

          <div class="flex justify-between">
            <div class="text-sm"> 固定侧边栏 </div>
            <n-switch v-model:value="settingStore.menuSetting.fixed" />
          </div>

          <div class="flex justify-between">
            <div class="text-sm"> 固定多页签 </div>
            <n-switch v-model:value="settingStore.multiTabsSetting.fixed" />
          </div>-->
        </section>

        <section class="mb-4">
          <n-divider title-placement="center">界面显示</n-divider>

          <div class="flex justify-between my-4">
            <div class="text-sm"> 显示重载页面按钮</div>
            <n-switch v-model:value="settingStore.showHeaderReload" />
          </div>

          <div class="flex justify-between my-4">
            <div class="text-sm"> 显示面包屑显示图标</div>
            <n-switch v-model:value="settingStore.showCrumbIcon" />
          </div>

          <div class="flex justify-between my-4">
            <div class="text-sm"> 显示多页签</div>
            <n-switch v-model:value="settingStore.multiTabsEnabled" />
          </div>
        </section>

        <section class="mb-4">
          <n-divider title-placement="center">动画</n-divider>

          <div class="flex justify-between my-4">
            <div class="text-sm"> 启用动画</div>
            <n-switch v-model:value="settingStore.tabAnimationEnabled" />
          </div>

          <div class="flex justify-between items-center my-4">
            <div class="text-sm"> 动画类型</div>
            <n-select
              v-model:value="settingStore.pageAnimateType"
              class="w-1/2"
              :options="AppAnimates"
            />
          </div>
        </section>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { CheckOutlined } from '@vicons/antd'
import { Moon, SunnySharp } from '@vicons/ionicons5'
import { AppAnimates, AppThemeList } from '@/constants/preference'
import { useAppPreferenceStore } from '@/store/modules/preference'

const settingStore = useAppPreferenceStore()

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

watch(
  () => settingStore.darkTheme,
  (to) => {
    settingStore.navTheme = to ? 'header-dark' : 'light'
  }
)

function togNavTheme(theme: string) {
  settingStore.navTheme = theme
  if (settingStore.navMode === 'horizontal' && ['light'].includes(theme)) {
    settingStore.navTheme = 'dark'
  }
}

function togTheme(color: string) {
  settingStore.appTheme = color
}

function togNavMode(mode: string, mix = false) {
  settingStore.navMode = mode
  settingStore.menuSetting.mixMenu = mix
}

const emits = defineEmits(['update:show'])

function updateShow(value: boolean) {
  emits('update:show', value)
}
</script>

<style lang="scss" scoped>
.drawer {
  .n-divider:not(.n-divider--vertical) {
    margin: 10px 0;
  }

  .color-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 21px;
    margin: 3px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
  }

  .dark-switch .n-switch {
    ::v-deep(.n-switch__rail) {
      background-color: #000e1c;
    }
  }
}
</style>
