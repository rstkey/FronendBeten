<template>
  <div class="card border-info mb-4">
    <div class="card-header">{{ $t("Phase Information") }}</div>
    <div class="row mt-3">
      <div class="col-12 text-center">
        <h5>{{ phase.title }}</h5>
      </div>
    </div>
    <CRow class="m-3">
      <CCol :md="12">
        <h3>{{ $t("Assigned services") }}</h3>
        <CTable class="table table-responsive">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{{ $t("Title") }}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableRow v-for="client in phase.services" :key="client.id">
            <CTableDataCell>{{ client.title }}</CTableDataCell>
            <CTableDataCell>
              <CButton color="info" @click="createCommit(client.id)">
                {{ $t("Commit Service") }}
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTable>
      </CCol>
    </CRow>
    <CModal
      size="md"
      :visible="is_phase_modal_visible"
      @close="is_phase_modal_visible = false"
      class="modal-popup-detail"
      data-backdrop="static"
      data-keyboard="false"
    >
      <CModalHeader>
        <CModalTitle>{{ $t('Create commit') }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CreateCommit :service="service" />
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          class="text-white"
          @click="is_phase_modal_visible = false"
        >
          {{ $t('Close') }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import CreateCommit from "../Commit/CreateCommit.vue";

export default {
  name: "PhaseDetails",
  components: { CreateCommit },
  data: () => ({
    phase: {},
    is_phase_modal_visible: false,
    service: null,
  }),
  methods: {
    createCommit(id) {
      this.service = id;
      this.is_phase_modal_visible = true;
    },
  },
  mounted: async function () {
    await this.$axios
      .get(`/phases/${this.$decrypt(this.$route.params.id)}`)
      .then((response) => (this.phase = response.data));
  },
};
</script>
