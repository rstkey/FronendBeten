<template>
  <div class="card border-info mb-4">
    <div class="card-header">{{ $t("Service Commit Information") }}</div>
    <CRow class="mt-3 ms-3 pb-3">
      <CCol :md="6">
        <CTable class="table table-responsive">
          <CTableRow>
            <CTableDataCell>{{ $t("Title") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.service?.title }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("City") }}</CTableDataCell>
            <CTableDataCell>{{
              service_commit.service?.city_id
            }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("Before date") }}</CTableDataCell>
            <CTableDataCell>{{
              service_commit.service?.before_date
            }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("Exact date") }}</CTableDataCell>
            <CTableDataCell>{{
              service_commit.service?.exact_date
            }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("After date") }}</CTableDataCell>
            <CTableDataCell>{{
              service_commit.service?.after_date
            }}</CTableDataCell>
          </CTableRow>
          <hr />
          <CTableRow>
            <CTableDataCell>{{ $t("Badge") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.badge }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("Schedule At") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.schedule_at }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("Started") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.started_at }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("Ended") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.ended_at }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t("From") }}</CTableDataCell>
            <CTableDataCell>{{ service_commit.from_location }}</CTableDataCell>
          </CTableRow>
        </CTable>

        <button
          :class="
            service_commit_logs?.length && service_commit.ended_at != null
              ? 'btn btn-light'
              : 'btn btn-success text-white'
          "
          @click="showLogsButtonAction()"
        >
          {{ $t("Add logs") }}
        </button>
        <button
          class="btn btn-info text-white mx-2"
          v-if="
            service_commit_logs?.length && service_commit.started_at == null
          "
          @click="initialize"
        >
          {{ $t("Initialize") }}
        </button>
        <button
          class="btn btn-warning text-white mx-2"
          v-if="
            service_commit_logs?.length &&
            service_commit.started_at != null &&
            service_commit.ended_at == null
          "
          @click="release"
        >
          {{ $t("Finished") }}
        </button>

        <br />
      </CCol>
      <CCol :sm="6">
        <div v-if="service_commit_logs?.length">
          <CRow>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">{{
                    $t("Model Type")
                  }}</CTableHeaderCell>
                  <CTableHeaderCell scope="col">{{
                    $t("Model name")
                  }}</CTableHeaderCell>
                  <CTableHeaderCell scope="col">{{
                    $t("Role")
                  }}</CTableHeaderCell>
                  <CTableHeaderCell scope="col">{{
                    $t("Delete")
                  }}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="log in service_commit_logs">
                  <CTableDataCell>{{ $t(log.title) }}</CTableDataCell>
                  <CTableDataCell>{{ log.name }}</CTableDataCell>
                  <CTableDataCell>{{ $t(log.role) }}</CTableDataCell>
                  <CTableDataCell>
                    <button
                      class="btn btn-sm btn-danger text-white"
                      @click="deleteLog(log.id)"
                      :title="$t('Delete')"
                    >
                      <ion-icon name="trash-bin-outline"></ion-icon>
                    </button>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CRow>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav :aria-label="$t('Service commits navigation')">
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
        </div>
      </CCol>
    </CRow>
  </div>
  <Concurrable
    v-if="service_commit.is_concurrable"
    type="ServiceCommit"
    :id="service_commit.id"
  />

  <CModal
    size="sm"
    :visible="show_add_log_form"
    @close="show_add_log_form = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Add log") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CreateLog :service_commit_id="service_commit.id" @created="getCommit" />
    </CModalBody>
  </CModal>
</template>

<script>
import swal from "sweetalert";
import CreateLog from "@/components/CreateLog.vue";
export default {
  name: "ServiceCommitInfo",
  components: {
    CreateLog,
  },
  data: () => ({
    service_commit: {},
    show_add_log_form: false,
    service_commit_logs: [],
    pagination: [],
  }),
  methods: {
    gotoPage: async function (url) {
      await this.$axios.get(url).then((response) => {
        this.service_commit_logs = response.data.logs.data;
        this.pagination = response.data.logs.links;
      });
    },
    getCommit() {
      this.$axios
        .get(`/service_commits/${this.$decrypt(this.$route.params.id)}`)
        .then((response) => {
          this.service_commit = response.data.commit;
          this.service_commit_logs = response.data.logs.data;
          this.pagination = response.data.logs.links;
        });
    },
    initialize() {
      this.$axios
        .get(`/service_commits/initialize/${this.service_commit.id}`)
        .then(() => this.getCommit());
    },
    release() {
      this.$axios
        .post("/service_commits/release", {
          id: this.service_commit.id,
        })
        .then(() => this.getCommit());
    },
    showLogsButtonAction() {
      if (
        this.service_commit_logs?.length &&
        this.service_commit.ended_at != null
      ) {
        swal({
          title: this.$t("Information"),
          text: this.$t("Task finished. Please create a new service commit."),
          icon: "info",
        });
        return;
      } else {
        this.show_add_log_form = true;
      }
    },
    deleteLog(id) {
      this.$axios.delete(`service_commit_log/${id}`)
        .then(() => this.service_commit_logs.splice(
          this.service_commit_logs.findIndex((log) => log.id === id),
          1
        ))
    },
  },
  mounted() {
    this.getCommit();
  },
};
</script>
