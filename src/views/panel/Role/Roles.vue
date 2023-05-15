<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t("Roles") }}</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Name")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="role in roles" :key="role.id">
                <CTableDataCell>{{ $t(role.name) }}</CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(role.id)"
                    v-if="$can('roles.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update Role',
                      params: { id: this.$encrypt(role.id) },
                    }"
                    v-if="$can('roles.edit')"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white m-1"
                      :xl="0"
                      :title="$t('Edit')"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CModal
    size="md"
    :visible="is_role_modal_visible"
    @close="is_role_modal_visible = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Role Information") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>{{ $t("Name") }}</CTableHeaderCell>
              <CTableDataCell>{{ $t(role.name) }}</CTableDataCell>
            </CTableRow>
            <CTableRow class="mt-8" v-if="role.users.length">
              <CTableHeaderCell>{{ $t("Users") }}</CTableHeaderCell>
              <CTableRow v-for="user in role.users" :key="user">
                {{ $t(user) }}
              </CTableRow>
            </CTableRow>
          </CTable>
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
export default {
  name: "Roles",
  data: () => ({
    roles: [],
    loading: false,
    is_role_modal_visible: false,
    role: {}, // Currently shown role
  }),
  methods: {
    viewDetails: async function (id) {
      await this.$axios
        .get(`/roles/${id}`)
        .then((response) => (this.role = response.data));
      this.is_role_modal_visible = true;
    },
  },
  mounted: async function () {
    this.loading = true;
    await this.$axios.get("/roles").then((response) => {
      this.roles = response.data;
      this.loading = false;
    });
  },
};
</script>
