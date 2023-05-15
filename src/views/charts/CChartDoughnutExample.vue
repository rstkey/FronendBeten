<template>
  <CChartDoughnut :data="defaultData" :height="30" />
</template>

<script>
import { CChartDoughnut } from '@coreui/vue-chartjs'
export default {
  name: 'CChartDoughnutExample',
  components: { CChartDoughnut },
  computed: {
    defaultData() {
      return {
        labels: ['Clients', 'Contracts', 'Vehicles', 'Crew'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10],
          },
        ],
      }
    },
  },
}
</script>
