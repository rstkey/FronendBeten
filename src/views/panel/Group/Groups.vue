<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t("Groups") }}</CCardTitle>
          <router-link
            :to="{ name: 'Create group' }"
            v-if="$can('groups.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="people-outline"></ion-icon>&nbsp;
              {{ $t("Create group") }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.title"
                :placeholder="$t('Search title')"
                @keyup="filter(search.title, $event)"
              />
            </CCol>
            <CCol :md="4">
              <input
                type="text"
                class="form-control"
                v-model="search.crew_member"
                :placeholder="$t('Search crew member')"
                @keyup="filter(search.crew_member, $event)"
              />
            </CCol>
          </CRow>
          <hr />
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("Loading...") }}</span>
            </CCol>
          </CRow>
          <CRow v-if="groups.length === 0 && !loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("No results") }}</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading && groups.length > 0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  {{ $t("Title") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Crew member") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Clients virtual count") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Clients count") }}
                </CTableHeaderCell>
                <CTableHeaderCell
                  style="width: 20%"
                  scope="col"
                  :aria-colspan="2"
                >
                  {{ $t("Actions") }}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="group in groups" :key="group.id">
                <CTableDataCell>{{ group.title }}</CTableDataCell>
                <CTableDataCell>{{ group.crew.fullname }}</CTableDataCell>
                <CTableDataCell>{{ group.clients_virtual_count }}</CTableDataCell>
                <CTableDataCell>{{ group.clients_count }}</CTableDataCell>
                <CTableDataCell>
                  <router-link
                    :to="{
                      name: 'Group details',
                      params: { id: this.$encrypt(group.id) },
                    }"
                    v-if="$can('groups.view') || isSupervisor(group)"
                  >
                    <CButton
                      class="btn btn-sm btn-info text-white m-1"
                      :xl="0"
                      :title="$t('Detail')"
                    >
                      <ion-icon name="eye-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <router-link
                    :to="{
                      name: 'Update Group',
                      params: { id: this.$encrypt(group.id) },
                    }"
                    v-if="$can('groups.edit') || isSupervisor(group)"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white m-1"
                      :xl="0"
                      :title="$t('Edit')"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white"
                    @click="deleteGroup(group.id, group.clients_count)"
                    :title="$t('Delete')"
                    :disabled="deleteDisabled(group)"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav :aria-label="$t('Groups navigation')">
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
import can from "@/plugins/gate";
import { debounce } from "@/utils/helper";

export default {
  name: "Groups",
  data: () => ({
    debounceFn: null,
    groups: [],
    search: {},
    loading: false,
    pagination: [],
  }),
  methods: {
    isSupervisor: function (group) {
      let user = JSON.parse(localStorage.getItem("user"));
      return user.id === group.crew.user_id;
    },
    deleteDisabled(group) {
      if (group.clients_count !== 0) {
        return false
      }
      if (can('groups.delete')) {
        return false
      }
      if (this.isSupervisor(group)) {
        return false
      }
      return true
    },
    async getGroups(reset = false) {
      this.loading = true;
      await this.$axios
        .get('/groups', {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.groups = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getGroups(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    gotoPage: async function (url) {
      this.loading = true;
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.groups = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    deleteGroup: async function (id, clientCount) {
      if(clientCount > 0) {
        swal(this.$i18n.t("Group has clients, you should remove all clients to delete the group"), {
          icon: "info",
          timer: 6000,
        });
      }else{
        await swal({
          title: this.$i18n.t("Are you sure?"),
          text: this.$i18n.t("Once deleted, you will not be able to recover!"),
          icon: "warning",
          buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            this.$axios.delete(`/groups/${id}`).then(
              this.groups.splice(
                this.groups.findIndex((group) => group.id === id),
                1
              )
            );
            swal(this.$i18n.t("Group has been deleted!"), {
              icon: "success",
              timer: 3000,
            });
          }
        });
      }

    },
  },
  async mounted() {
    await this.getGroups();
    this.debounceFn = debounce(() => this.getGroups(), 500);
  },
};
</script>
