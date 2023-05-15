<template>
  <CCol class="card bg-light border-top-3 border-secondary p-0 mt-3">
    <CCardHeader class="font-weight-bold">{{ $t('Concurrents') }}</CCardHeader>
    <CCard class="mt-1">
      <CAlert color="success" class="m-2" v-show="show_message">
        {{ message }}
        <span class="pull-right cursor-pointer" @click="show_message = false">
          X
        </span>
      </CAlert>
      <CCardBody class="p-0">
        <CTable responsive hover class="cursor-pointer">
          <CTableBody>
            <template v-for="concurrent in concurrents" :key="concurrent.id">
              <CTableRow>
                <CTableHeaderCell scope="row">
                  {{ concurrent.starting_at }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="row">
                  {{ concurrent.ending_at }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="row">
                  {{ $t(concurrent.extra.frequency) }}
                </CTableHeaderCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white"
                    @click="view(concurrent.id)"
                    :title="$t('View details')"
                  >
                    <ion-icon
                      :name="`eye-${
                        extra_shown[concurrent.id] ? 'off-' : ''
                      }outline`"
                    ></ion-icon>
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-warning text-white"
                    @click="deleteConcurrent(concurrent.id)"
                    :title="$t('Edit')"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-danger text-white"
                    @click="deleteConcurrent(concurrent.id)"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
              <Transition name="fade">
                <CTableRow v-if="extra_shown[concurrent.id]">
                  <CTableDataCell colspan="8">
                    <ConcurrentExtra :extra="concurrent.extra" />
                  </CTableDataCell>
                </CTableRow>
              </Transition>
            </template>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
    <CButton
      :color="form_shown ? 'danger' : 'success'"
      class="text-white"
      @click="form_shown = !form_shown"
    >
      {{ form_shown ? $t('Close') : $t('Add') }}&nbsp;
      <ion-icon :name="`${form_shown ? 'close' : 'add'}-circle-outline`">
      </ion-icon>
    </CButton>
    <Transition name="fade">
      <!-- Pass the type & id props, needed for posting the model_type and model_id -->
      <CreateConcurrent v-if="form_shown" :type="type" :id="id" />
    </Transition>
  </CCol>
</template>

<script>
import CreateConcurrent from './CreateConcurrent'
import ConcurrentExtra from './ConcurrentExtra'

export default {
  name: 'Concurrable',
  components: {
    CreateConcurrent,
    ConcurrentExtra,
  },
  props: ['type', 'id'],
  data: () => ({
    concurrents: [],
    show_message: false,
    message: '',
    form_shown: false,
    // Array of booleans because we can show multiple extras
    extra_shown: [],
  }),
  methods: {
    async deleteConcurrent(id) {
      await this.$axios.delete(`/concurrents/${id}`).then(() => {
        this.concurrents.splice(
          this.concurrents.findIndex((concurrent) => concurrent.id === id),
          1,
        ),
          (this.message = 'Concurrent deleted successfully.')
        this.show_message = true
      })
    },
    view: async function (id) {
      this.extra_shown[id] = !this.extra_shown[id]
    },
  },
  async mounted() {
    await this.$axios
      .get(`/concurrents/${this.type}/${this.id}`)
      .then((response) => (this.concurrents = response.data))
  },
}
</script>
