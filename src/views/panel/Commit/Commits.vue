<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t("Service Commits") }}</CCardTitle>
          <router-link
            :to="{ name: 'Create commit' }"
            v-if="$can('commits.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="create-outline"></ion-icon>&nbsp;
              {{ $t("Create commit") }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Service")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Badge")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Schedule At")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Started")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("From")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Supervisor")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Phase")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="commit in commits" :key="commit.id">
                <CTableDataCell>{{ commit.service.title }}</CTableDataCell>
                <CTableDataCell>{{ commit.badge }}</CTableDataCell>
                <CTableDataCell>{{ commit.schedule_at }}</CTableDataCell>
                <CTableDataCell>{{ commit.started_at }}</CTableDataCell>
                <CTableDataCell>{{ commit.from_location }}</CTableDataCell>
                <CTableDataCell>{{ commit.supervisor.name }}</CTableDataCell>
                <CTableDataCell>{{ commit.phase?.title }}</CTableDataCell>
                <CTableDataCell>
                  <router-link
                    :to="{
                      name: 'Service Commit details',
                      params: { id: this.$encrypt(commit.id) },
                    }"
                    v-if="$can('commits.view')"
                  >
                    <button
                      class="btn btn-sm btn-info text-white mx-1"
                      :title="$t('View details')"
                    >
                      <ion-icon name="eye-outline"></ion-icon>
                    </button>
                  </router-link>
                  <router-link
                    :to="{
                      name: 'Update Service Commit',
                      params: { id: this.$encrypt(commit.id) },
                    }"
                    v-if="$can('commits.edit')"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white mx-1"
                      :title="$t('Edit')"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white"
                    @click="deleteCommit(commit.id)"
                    :title="$t('Delete')"
                    v-if="$can('commits.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Service commits navigation">
                <ul class="pagination">
                  <template v-for="page in pagination" :key="page">
                    <li class="page-item" :class="{ active: page.active }">
                      <a
                        @click.prevent="gotoPage(page.url)"
                        class="page-link"
                        :class="{ disabled: !page.url }"
                        v-html="page.label"
                      ></a>
                    </li>
                  </template>
                </ul>
              </nav>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: "Commits",
  data: () => ({
    commits: [],
    pagination: [],
  }),
  methods: {
    gotoPage: async function (url) {
      await this.$axios.get(url).then((response) => {
        this.commits = response.data.data;
        this.pagination = response.data.links;
      });
    },
    async deleteCommit(id) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/service_commits/${id}`).then(() => {
            this.commits.splice(
              this.commits.findIndex((commit) => commit.id === id),
              1
            );
          });
          swal(this.$i18n.t("Service commit has been deleted!"), {
            icon: "success",
            timer: 3000,
          });
        }
      });
    },
  },
  async mounted() {
    await this.$axios
      .get("/service_commits")
      .then((response) => {
        this.commits = response.data.data;
        this.pagination = response.data.links;
      })
      .catch((error) => {
        swal({
          title: error.response.statusText,
          text: error.response.data.message,
          icon: "error",
        });
      });
  },
};
</script>
