<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav>
        <CNavItem>
          <CDropdown variant="nav-item" class="pt-2">
            <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
              <CIcon class="mx-2" v-if="$i18n.locale == 'ar'" icon="cifSa" size="lg" />
              <CIcon class="mx-2" v-if="$i18n.locale == 'en'" icon="cifGb" size="lg" />
            </CDropdownToggle>
            <CDropdownMenu class="pt-0">
              <CDropdownItem @click="changeLocale('ar')">
                <CIcon class="mx-2" icon="cifSa" size="lg" /> العربية
              </CDropdownItem>
              <CDropdownItem @click="changeLocale('en')">
                <CIcon class="mx-2" icon="cifGb" size="lg" /> English
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-bell" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-list" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-envelope-open" size="lg" />
          </CNavLink>
        </CNavItem>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  methods: {
    changeLocale(locale) {
      localStorage.setItem('locale', locale)
      this.$i18n.locale = locale
      let dir = locale === 'ar' ? 'rtl' : 'ltr'
      localStorage.setItem('dir', dir)
      document.dir = dir
      document.title = this.$i18n.t('Murafiq')
    },
  },
}
</script>
