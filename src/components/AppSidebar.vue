<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
  >
    <CSidebarBrand>
      <router-link to="/">{{
        sidebarUnfoldable ? 'M' : $i18n.t('Murafiq')
      }}</router-link>
    </CSidebarBrand>
    <AppSidebarNav />
    <CDropdown>
      <CDropdownToggle color="dark">
        <CIcon icon="cil-settings" class="settings-icon" /> {{ $t("Settings") }}
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem href="/roles">{{ $t("Roles & Permissions") }}</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
    <CSidebarToggler
      class="d-none d-lg-flex"
      @click="$store.commit('toggleUnfoldable')"
    />
  </CSidebar>
</template>

<script>
import store from '../store'
import { AppSidebarNav } from './AppSidebarNav'

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  computed: {
    sidebarUnfoldable: () => store.state.sidebarUnfoldable,
    sidebarVisible: () => store.state.sidebarVisible
  },
}
</script>

<style scoped>
.sidebar-brand a, li a {
  text-decoration: none;
  font-family: Scripto;
  font-size: 2rem;
  color: white;
}
.settings-icon {
  margin-left: 8px;
}
</style>
