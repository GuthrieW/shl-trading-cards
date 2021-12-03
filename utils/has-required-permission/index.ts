const hasRequiredPermisson = (requiredPermissions, user) => {
  console.log(
    requiredPermissions.some(
      (permission) => user.permissions.indexOf(permission) >= 0
    )
  )

  if (requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.some(
    (permission) => user.permissions.indexOf(permission) >= 0
  )
}

export default hasRequiredPermisson
