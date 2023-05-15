<template>
  <CCol class="card bg-light border-top-3 p-0 mt-3">
    <CCardHeader class="font-weight-bold">{{ $t('Documents') }}</CCardHeader>
    <CCard class="mt-1">
      <CAlert color="success" class="m-2" v-show="message">
        {{ message }}
        <span class="cursor-pointer" :class="dir" @click="message = ''"> X </span>
      </CAlert>
      <CAlert color="danger" class="m-2" v-show="error_message">
        {{ error_message }}
        <span class="cursor-pointer" :class="dir" @click="error_message = ''">
          X
        </span>
      </CAlert>
      <CCardBody class="p-0" v-if="showListing">
        <CTable responsive hover class="mb-0">
          <CTableBody>
            <CTableRow
              v-if="documents.length === 0"
              class="text-center d-block p-1"
            >
              {{ $t('No documents') }}
            </CTableRow>
            <CTableRow v-for="document in documents" :key="document.id">
              <CTableDataCell scope="row">
                {{ document.title }}
              </CTableDataCell>
              <CTableDataCell scope="row">
                {{ document.created_by }}
              </CTableDataCell>
              <CTableDataCell>
                <a
                  class="btn btn-sm btn-info text-white m-1"
                  :href="document.path"
                  :title="$t('Download document')"
                  :download="document.title"
                  target="_blank"
                >
                  <ion-icon name="cloud-download-outline"></ion-icon>
                </a>
              </CTableDataCell>
              <CTableDataCell>
                <a
                  class="btn btn-sm btn-info text-white m-1"
                  :href="document.path"
                  :title="$t('View details')"
                  target="_blank"
                >
                  <ion-icon name="eye-outline"></ion-icon>
                </a>
              </CTableDataCell>
              <CTableDataCell :aria-colspan="2">
                <button
                  class="btn btn-sm btn-danger text-white m-1"
                  @click="deleteDocument(document.id)"
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
    <CForm class="p-2" @submit.prevent="upload" ref="uploadForm">
      <CRow class="mt-1">
       <CInputGroup class="mb-0">
          <input
            type="text"
            class="form-control sm"
            :placeholder="$t('Title')"
            v-model="title"
            required
          />
           <CInputGroupText id="basic-addon2" class="p-0" >
              <label for="docsel1" class="btn btn-info btn-sm">
                {{ $t('Add document') }}
              </label>
            </CInputGroupText>
          <input
            type="file"
            accept="image/*,.pdf"
            class="d-none"
            ref="docs"
            id="docsel1"
            multiple
          />

          <CButton
            type="submit"
            color="success"
            class="mt-0 text-white btn-sm"
            shape="rounded-0"
          >
            {{ $t('Upload') }}
          </CButton>
        </CInputGroup>
      </CRow>
    </CForm>
  </CCol>
</template>

<script>
export default {
  name: 'Documentable',
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    showListing: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    documents: [],
    error_message: '',
    message: '',
    files: [],
    title: '',
  }),
  computed: {
    dir() {
      return document.dir === 'rtl' ? 'float-end' : 'pull-right'
    }
  },
  methods: {
    async upload() {
      /*
        Initialize the form data
      */
      let form_data = new FormData()
      form_data.append('title', this.title)

      /*
        Iteate over any file sent over appending the files
        to the form data.
      */
      for (let i = 0; i < this.$refs.docs.files.length; i++) {
        form_data.append(`documents[${i}]`, this.$refs.docs.files[i])
      }

      /*
        Make the request to the POST /select-files URL
      */
      await this.$axios
        .post(`/documents/${this.type}/${this.id}`, form_data)
        .then(() => {
          this.error_message = '' // Hide previous error message if any
          this.getDocuments()
          this.message = this.$i18n.t('Document uploaded successfully.')
          this.$refs.uploadForm.$el.reset()
          this.$emit('document_created')
        })
        .catch((error) => {
          this.error_message = error.response.data.message
        })
    },
    async deleteDocument(doc_id) {
      await this.$axios.delete(`/documents/${doc_id}`).then(() => {
        this.documents = this.documents.filter((doc) => doc.id !== doc_id)
        this.message = this.$i18n.t('Document deleted successfully.')
        setTimeout(() => {
          this.message = ''
        }, 3000)
      })
    },
    async getDocuments() {
      await this.$axios
        .get(`/documents/${this.type}/${this.id}`)
        .then((response) => {
          this.documents = response.data
        })
    },
  },
  mounted() {
    this.getDocuments()
  },
}
</script>
