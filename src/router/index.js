import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import i18n from '@/plugins/i18n'

const routes = [
  {
    path: '/dashboard',
    name: 'Home',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      // Other Pages
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/panel/User/Users'),
      },
      {
        path: '/users/create',
        name: 'Create user',
        component: () => import('@/views/panel/User/CreateUser'),
      },
      {
        path: '/users/edit/:id',
        name: 'Update user',
        component: () => import('@/views/panel/User/UpdateUser'),
      },
      {
        path: '/settings',
        component: () => import('@/views/Settings'),
      },
      {
        path: '/clients',
        name: 'Clients',
        component: () => import('@/views/panel/Client/Clients'),
      },
      {
        path: '/clients/create',
        name: 'Create client',
        component: () => import('@/views/panel/Client/CreateClient'),
      },
      {
        path: '/clients/edit/:id',
        name: 'Update client',
        component: () => import('@/views/panel/Client/UpdateClient'),
      },
      {
        path: '/crews',
        name: 'Crews',
        component: () => import('@/views/panel/Crew/Crews'),
      },
      {
        path: '/crews/create',
        name: 'Create crew',
        component: () => import('@/views/panel/Crew/CreateCrew'),
      },
      {
        path: '/crews/edit/:id',
        name: 'Update crew',
        component: () => import('@/views/panel/Crew/UpdateCrew'),
      },
      // Services menu
      {
        path: '/services',
        name: 'Services',
        component: () => import('@/views/panel/Service/Services'),
      },
      {
        path: '/services/create',
        name: 'Create service',
        component: () => import('@/views/panel/Service/CreateService'),
      },
      {
        path: '/services/:id',
        name: 'Update service',
        component: () => import('@/views/panel/Service/UpdateService'),
      },
      {
        path: '/services/commits',
        name: 'Service Commits',
        component: () => import('@/views/panel/Commit/Commits'),
      },
      // Service Commits
      {
        path: '/services/commits/:id',
        name: 'Service Commit details',
        component: () => import('@/views/panel/Commit/CommitInfo'),
      },
      {
        path: '/phases/:id',
        name: 'Phase details',
        component: () => import('@/views/panel/Phase/PhaseInfo'),
      },
      {
        path: '/services/commits/create',
        name: 'Create commit',
        component: () => import('@/views/panel/Commit/CreateCommit'),
      },
      {
        path: '/services/commits/edit/:id',
        name: 'Update Service Commit',
        component: () =>
          import('@/views/panel/Commit/UpdateServiceCommit'),
      },
      // Service commits end

      // Phases Menu
      {
        path: '/phases',
        name: 'Phases',
        component: () => import('@/views/panel/Phase/Phases'),
      },
      {
        path: '/phases/create',
        name: 'Create phase',
        component: () => import('@/views/panel/Phase/CreatePhase'),
      },
      {
        path: '/phases/update/:id',
        name: 'Update phase',
        component: () => import('@/views/panel/Phase/UpdatePhase'),
      },
      // Phases Menu ends here

      // Meals Menu
      {
        path: '/meals',
        name: 'All meals',
        component: () => import('@/views/panel/Meal/Meals/Meals'),
      },
      {
        path: '/meals/create',
        name: 'Create meal',
        component: () => import('@/views/panel/Meal/Meals/CreateMeal'),
      },
      {
        path: '/meals/update/:id',
        name: 'Update Meal',
        component: () => import('@/views/panel/Meal/Meals/UpdateMeal'),
      },
      {
        path: '/meals/types',
        name: 'Types',
        component: () => import('@/views/panel/Meal/Types/Types'),
      },
      {
        path: '/meals/types/create',
        name: 'Create type',
        component: () => import('@/views/panel/Meal/Types/CreateType'),
      },
      {
        path: '/meals/:id',
        name: 'Edit Meal Type',
        component: () => import('@/views/panel/Meal/Types/UpdateType'),
      },

      // Meals Menu ends here

      {
        path: '/groups',
        name: 'Groups',
        component: () => import('@/views/panel/Group/Groups'),
      },
      {
        path: '/groups/create',
        name: 'Create group',
        component: () => import('@/views/panel/Group/CreateGroup'),
      },
      {
        path: '/groups/edit/:id',
        name: 'Update Group',
        component: () => import('@/views/panel/Group/UpdateGroup'),
      },
      {
        path: '/groups/:id',
        name: 'Group details',
        component: () => import('@/views/panel/Group/GroupInfo'),
      },
      {
        path: '/vehicles',
        name: 'Vehicles',
        component: () => import('@/views/panel/Vehicle/Vehicles'),
      },
      {
        path: '/vehicles/create',
        name: 'Create vehicle',
        component: () => import('@/views/panel/Vehicle/CreateVehicle'),
      },
      {
        path: '/vehicles/update/:id',
        name: 'Update Vehicle',
        component: () => import('@/views/panel/Vehicle/UpdateVehicle'),
      },
      {
        path: '/dormitories',
        name: 'Dormitories',
        component: () => import('@/views/panel/Dormitory/Dormitories'),
      },
      {
        path: '/dormitories/create',
        name: 'Create dormitory',
        component: () => import('@/views/panel/Dormitory/CreateDormitory'),
      },
      {
        path: 'dormitories/update/:id',
        name: 'Update Dormitory',
        component: () => import('@/views/panel/Dormitory/UpdateDormitory'),
      },
      // Hospitalities Menu
      {
        path: '/hospitalities',
        name: 'Hospitalities',
        component: () =>
          import('@/views/panel/Hospitality/Hospitalities/Hospitalities'),
      },
      {
        path: '/hospitalities/create',
        name: 'Create hospitality',
        component: () =>
          import('@/views/panel/Hospitality/Hospitalities/CreateHospitality'),
      },
      {
        path: '/hospitalities/update/:id',
        name: 'Update Hospitality',
        component: () =>
          import('@/views/panel/Hospitality/Hospitalities/UpdateHospitality'),
      },
      {
        path: '/hospitalities/transactions',
        name: 'Transactions',
        component: () =>
          import('@/views/panel/Hospitality/Transactions/Transactions'),
      },
      {
        path: '/hospitalities/transactions/create',
        name: 'Create transaction',
        component: () =>
          import('@/views/panel/Hospitality/Transactions/CreateTransaction'),
      },
      // Hospitalities Menu ends here
      
      // Roles Menu
      {
        path: '/roles',
        name: 'All roles',
        component: () => import('@/views/panel/Role/Roles'),
      },
      {
        path: '/roles/update/:id',
        name: 'Update Role',
        component: () => import('@/views/panel/Role/UpdateRole'),
      },

      // Roles Menu ends here
    ],
  },
  {
    path: '/panel',
    redirect: '/panel/404',
    name: 'Panel',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      // Authentication
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/panel/Auth/Login'),
      },
      {
        path: 'verify/otp',
        name: 'verify.otp',
        meta: { isVerifyOtp: true },
        component: () => import('@/views/panel/Auth/VerifyOtp.vue'),
      },
      {
        path: 'reset',
        name: 'reset_password',
        component: () => import('@/views/panel/Auth/ResetPassword'),
      },
      {
        path: 'new_password/:hash',
        name: 'new_passport',
        component: () => import('@/views/panel/Auth/NewPassword'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/panel/Auth/Register'),
      },
    ],
  },
  {
    path: '/',
    name: 'DefaultPage',
    component: () => import('@/views/home/Home.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const auth_token = localStorage.getItem('auth_token')
  const auth_user_id = localStorage.getItem('auth_user_id')
  const reqAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isVerifyOtp = to.matched.some((record) => record.meta.isVerifyOtp)
  const defaultQuery = { path: '/', query: {} }

  if (to.matched.length > 0) {
    if (reqAuth && !auth_token) {
      next(defaultQuery)
    } else if (!reqAuth && auth_token) {
      next('/dashboard')
    }else if(auth_user_id && !isVerifyOtp){
      next({name:'verify.otp'})
    }else if(!auth_user_id && isVerifyOtp){
      next(defaultQuery)
    } else {
      next()
    }
  } else {
    if (!auth_token) {
      next(defaultQuery)
    } else {
      next('/dashboard')
    }
  }
})

export default router
