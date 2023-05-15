import can from '@/plugins/gate'

const user = JSON.parse(localStorage.getItem('user'))

export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    visible: true,
  },
  {
    component: 'CNavTitle',
    name: 'User Management',
    visible: can('users.browse'),
  },
  {
    component: 'CNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-people',
    visible: can('users.browse'),
  },
  {
    component: 'CNavItem',
    name: 'Crew',
    to: '/crews',
    icon: 'cil-address-book',
    visible: can('crews.index'),
  },
  {
    component: 'CNavTitle',
    name: 'Manage Tasks',
  },
  {
    component: 'CNavItem',
    name: 'Services',
    to: '/services',
    icon: "cil-window",
    visible: can('services.index'),
  },
  {
    component: 'CNavItem',
    name: 'Service Commits',
    to: '/services/commits',
    icon: "cil-briefcase",
    visible: can('commits.index'),
  },
  {
    component: 'CNavItem',
    name: 'Phases',
    to: '/phases',
    icon: 'cil-media-step-forward',
    visible: can('phases.index'),
  },
  {
    component: 'CNavTitle',
    name: 'Manage Clients',
    visible: can('users.browse'),
  },
  {
    component: 'CNavItem',
    name: 'Clients',
    to: '/clients',
    icon:"cil-user",
    visible: can('clients.index'),
  },
  {
    component: 'CNavItem',
    name: 'Groups',
    to: '/groups',
    icon: 'cil-object-group',
    // if user is a supervisor of some group(s)...
    visible: can('groups.index') || user?.is_supervisor,
  },
  {
    component: 'CNavTitle',
    name: 'Manage Services',
  },
  {
    component: 'CNavItem',
    name: 'Vehicles Service',
    to: '/vehicles',
    icon: 'cil-car-alt',
    visible: can('vehicles.index'),
  },
  {
    component: 'CNavItem',
    name: 'Dormitories Service',
    to: '/dormitories',
    icon: 'cil-door',
    visible: can('dormitories.index'),
  },
  {
    component: 'CNavGroup',
    name: 'Meals Service',
    to: '/meals',
    icon: 'cil-fastfood',
    visible: can('meals.index'),
    items: [
      {
        component: 'CNavItem',
        name: 'All meals',
        to: '/meals',
        visible: can('meals.index'),
      },
      {
        component: 'CNavItem',
        name: 'Types',
        to: '/meals/types',
        visible: can('types.index'),
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Hospitalities Service',
    to: '/hospitalities',
    icon: 'cil-mood-good',
    visible: can('hospitalities.index'),
    items: [
      {
        component: 'CNavItem',
        name: 'Hospitalities',
        to: '/hospitalities',
        visible: can('hospitalities.index'),
      },
      {
        component: 'CNavItem',
        name: 'Transactions',
        to: '/hospitalities/transactions',
        visible: can('transactions.index'),
      },
    ],
  },
]
