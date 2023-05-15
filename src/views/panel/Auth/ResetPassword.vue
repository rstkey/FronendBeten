<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Reset Password</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      v-model="email"
                      autocomplete="email"
                    />
                  </CInputGroup>
                  <CRow>
                    <p>
                      {{ message }}
                    </p>
                  </CRow>
                  <CRow>
                    <CCol :xs="6">
                      <CButton @click="login" color="primary" class="px-4">
                        Send Link
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <p></p>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    email: '',
    message: '',
  }),
  methods: {
    login: async function () {
      return await this.$axios
        .post(`${process.env.VUE_APP_BASE_API_URL}/password/email`, {
          email: this.email,
        })
        .then((response) => {
          this.message = response.data.message
        })
        .catch((error) => {
          this.message = error.message
        })
    },
  },
}
</script>
