const user = JSON.parse(localStorage.getItem('user'))
const permissions = JSON.parse(localStorage.getItem('permissions'))

const can = (permission) => {
  let admin = user?.is_admin
  let wildcard = `${permission.split('.')[0]}.*`
  return (
    admin ||
    permissions?.includes(wildcard) ||
    permissions?.includes(permission)
  )
}

export default can
