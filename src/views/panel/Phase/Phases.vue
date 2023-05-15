<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Phases') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create phase' }"
            v-if="$can('phases.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="play-skip-forward-outline"></ion-icon>&nbsp;
              {{ $t('Create phase') }}
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
          </CRow>
          <hr />
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">Loading...</span>
            </CCol>
          </CRow>
          <CRow v-if="phases.length === 0 && !loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <span class="sr-only">No results</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading && phases.length > 0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Title') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Required') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Actions') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="phase in phases" :key="phase.id">
                <CTableDataCell>{{ phase.title }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="phase.is_required ? 'success' : 'warning'"
                    shape="rounded-pill"
                  >
                    {{ phase.is_required ? $t('Yes') : $t('No') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <router-link
                    :to="{
                      name: 'Phase details',
                      params: { id: this.$encrypt(phase.id) },
                    }"
                    v-if="$can('phases.view')"
                    :title="$t('View details')"
                  >
                    <button
                      class="btn btn-sm btn-info text-white mx-1"
                    >
                      <ion-icon name="eye-outline"></ion-icon>
                    </button>
                  </router-link>
                  <router-link
                    :to="{
                      name: 'Update phase',
                      params: { id: this.$encrypt(phase.id) },
                    }"
                    v-if="$can('phases.edit')"
                    :title="$t('Edit')"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white m-1"
                      :xl="0"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white"
                    @click="deletePhase(phase.id)"
                    v-if="$can('phases.delete')"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Phases navigation">
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
import { debounce } from '@/utils/helper'

export default {
  name: 'Phases',
  data: () => ({
    debounceFn: null,
    phases: [],
    search: {},
    loading: false,
    pagination: [],
  }),
  methods: {
    getPhases: async function (reset = false) {
      this.loading = true
      await this.$axios
        .get('/phases', {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.phases = response.data.data
          this.pagination = response.data.links
          this.loading = false
        })
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getPhases(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    gotoPage: async function (url) {
      this.loading = true
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.phases = response.data.data
          this.pagination = response.data.links
          this.loading = false
        })
    },
    deletePhase: async function (id) {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Once deleted, you will not be able to recover!'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/phases/${id}`).then(() => {
            this.phases.splice(
              this.phases.findIndex((phase) => phase.id === id),
              1
            );
          })
          swal(this.$i18n.t("Phase has been deleted!"), {
            icon: 'success',
            timer: 3000,
          })
        }
      })
    },
  },
  mounted: async function () {
    await this.getPhases()
    this.debounceFn = debounce(() => this.getPhases(), 500)
  },
}
</script>
