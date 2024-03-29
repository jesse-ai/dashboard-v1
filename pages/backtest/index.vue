<script setup lang="ts">
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()
const backtestStore = useBacktestStore()

onMounted(() => {
  const keys = Object.keys(backtestStore.tabs)
  if (keys.length > 0) {
    const firstTabKey = keys[0]
    const firstTab = backtestStore.tabs[firstTabKey]
    router.push({path: `/backtest/${firstTab.id}`})
  }
})
</script>
