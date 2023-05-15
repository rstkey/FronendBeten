<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Transactions') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create transaction' }"
            v-if="$can('transactions.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="swap-horizontal-outline"></ion-icon>&nbsp;
              {{ $t('Create transaction') }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Hospitality') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('To Model Type') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('To Model ID') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Quantity') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Extra') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Actions') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-warning text-white mx-1"
                    :title="$t('Edit')"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-danger text-white mx-1"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">2</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-warning text-white mx-1"
                    :title="$t('Edit')"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-danger text-white mx-1"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">3</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-warning text-white mx-1"
                    :title="$t('Edit')"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-danger text-white mx-1"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'Transactions',
}
</script>
