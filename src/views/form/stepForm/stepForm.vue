<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="分步表单">
        将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="填写转账信息" description="确保填写正确" />
          <n-step title="确认转账信息" description="确认转账信息" />
          <n-step title="完成转账" description="恭喜您，转账成功" />
        </n-steps>
        <step-one v-if="currentTab === 1" @next-step="nextStep" />
        <step-tow v-if="currentTab === 2" @next-step="nextStep" @prev-step="prevStep" />
        <step-three v-if="currentTab === 3" @prev-step="prevStep" @finish="finish" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import StepOne from './StepOne.vue'
import StepTow from './StepTwo.vue'
import StepThree from './StepThree.vue'

const currentTab = ref(1)
const currentStatus = ref('process')

function nextStep() {
  if (currentTab.value < 3) {
    currentTab.value += 1
  }
}

function prevStep() {
  if (currentTab.value > 1) {
    currentTab.value -= 1
  }
}

function finish() {
  currentTab.value = 1
}
</script>

<style lang="scss" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
