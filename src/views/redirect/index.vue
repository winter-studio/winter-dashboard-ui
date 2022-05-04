<script lang="tsx">
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NEmpty } from 'naive-ui'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const route = useRoute()
    const router = useRouter()
    onBeforeMount(() => {
      const { params, query } = route
      const { path } = params
      const toPath = '/' + (Array.isArray(path) ? path.join('/') : path)
      router.replace({
        path: toPath,
        query
      })
    })
    return () => <NEmpty />
  }
})
</script>
