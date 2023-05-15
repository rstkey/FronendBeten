<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>New Password</h1>
                  <p class="text-medium-emphasis">Enter New Password</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      v-model="form.email"
                      autocomplete="email"
                      disabled
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="********"
                      v-model="form.password"
                      autocomplete="password"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="********"
                      v-model="form.password_confirmation"
                      autocomplete="password"
                    />
                  </CInputGroup>
                  <CRow>
                    <p>
                      {{ message }}
                    </p>
                  </CRow>
                  <CRow>
                    <CCol :xs="6">
                      <CButton @click="resetPwd" color="primary" class="px-4">
                        Reset
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div></div>
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
  name: 'NewPassword',
  data: () => ({
    form: { email: '', token: '', password: '', password_confirmation: '' },
    message: '',
  }),
  methods: {
    resetPwd: async function () {
      return await this.$axios
        .post(`${process.env.VUE_APP_BASE_API_URL}/password/reset`, this.form)
        .then((response) => {
          if (response.status < 200) {
            this.$router.push('login')
          }
          this.message = response.data.message
        })
        .catch((error) => {
          if (error.response) {
            this.message = error.response.data.message
          } else {
            this.message = error.message
          }
        })
    },
  },
  mounted() {
    this.form.token = this.$route.params.hash
    this.form.email = this.$route.query.email
  },
}
</script>
