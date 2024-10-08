<template>
  <div class="view-account">
    <div class="flex items-end h-1/5 pb-5">
      <div class="flex flex-row items-center">
        <div>
          <img class="w-16" src="@/assets/images/logo.png" alt="" />
        </div>
        <div class="text-4xl font-bold mx-4">Winter Dashboard</div>
      </div>
    </div>
    <div class="view-account-container">
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="username">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <person-outline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              show-password-on="click"
              placeholder="password"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <lock-closed-outline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="rememberMe">{{
                  t('views.login.rememberme')
                }}</n-checkbox>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" size="large" :loading="loading" block @click="handleSubmit">
              {{ t('views.login.login') }}
            </n-button>
          </n-form-item>
        </n-form>
        <locale-selector />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { FormValidationError, useMessage, useThemeVars } from 'naive-ui'
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
import { RouteNames } from '@/router/base'
import { login } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import LocaleSelector from '@/components/application/LocaleSelector.vue'

interface FormState {
  username: string
  password: string
}
const themeVars = useThemeVars()
const formRef = ref()
const message = useMessage()
const loading = ref(false)
const rememberMe = ref(true)
const LOGIN_NAME = RouteNames.BASE_LOGIN_NAME
const loginBgColor = themeVars.value.loginBgColor

const { t } = useI18n()
const formInline = reactive({
  username: 'admin',
  password: '123456',
  isCaptcha: true
})

const rules = {
  username: { required: true, message: t('views.login.hint.username'), trigger: 'blur' },
  password: { required: true, message: t('views.login.hint.password'), trigger: 'blur' }
}

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value.validate(async (errors: Array<FormValidationError>) => {
    if (!errors) {
      const { username, password } = formInline
      message.loading(t('views.login.hint.logingin'))
      loading.value = true

      const params: FormState = {
        username,
        password
      }

      try {
        const res = await login(params)
        userStore.login(res.data!, rememberMe.value)
        await userStore.afterLogin()
        const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
        if (route.name === LOGIN_NAME) {
          router.replace('/')
        } else {
          router.replace(toPath)
        }
      } catch (err) {
        console.error(err)
        message.error(`登录失败:${(err as Error).message}`)
      } finally {
        loading.value = false
        message.destroyAll()
      }
    } else {
      message.error('请填写完整信息，并且进行验证码校验')
    }
  })
}
</script>

<style lang="scss" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: auto;
  background-color: v-bind(loginBgColor);

  &-container {
    flex: 1;
    width: 400px;
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (width >= 768px) {
  .view-account {
    background-image: url('../../assets/images/login.svg');
    background-repeat: no-repeat;
    background-position: 100% 100%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px;
  }
}
</style>
