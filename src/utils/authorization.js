const Unauthorized = () => {
  return <div>You are not authorized to access this page.</div>;
};

export default Unauthorized;

export function withAuth(Component, ComponentName) {
  let token;
  let userRole;
  let allowedRoles;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    userRole = localStorage.getItem("user_type");
    allowedRoles = JSON.parse(localStorage.getItem("allowedRoles"));
  }
  function getUserRole() {
    // const userRole = localStorage.getItem("user_type");
    return userRole;
  }

  function getAllowedRoles() {
    // Fetch allowed roles from localStorage or from server
    // const allowedRoles = JSON.parse(localStorage.getItem("allowedRoles"));
    // console.log("allowedRoles: ", allowedRoles);
    return allowedRoles || [];
  }

  const WithAuthComponent = (props) => {
    const userRole = getUserRole();
    const allowedRoles = getAllowedRoles();

    const isAuthorized = allowedRoles.some((role) => {
      if (userRole && role.module === ComponentName) {
        return true;
      }
      return false;
    });

    if (!isAuthorized) {
      return <Unauthorized />;
    }
    return <Component {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;

  return WithAuthComponent;
}
