<template>
  <div class="mt-4">
    <n-row :gutter="24">
      <n-col :span="24">
        <n-card content-style="padding: 0;" :bordered="false">
          <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
            <n-tab-pane name="流量趋势">
              <flux-trend />
            </n-tab-pane>
            <n-tab-pane name="访问量">
              <visit-amount />
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-col>
    </n-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import FluxTrend from './FluxTrend.vue'
import VisitAmount from './VisitAmount.vue'

export default defineComponent({
  components: { FluxTrend, VisitAmount },
  setup() {
    return {}
  }
})
</script>
