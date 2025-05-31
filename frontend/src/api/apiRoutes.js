export const apiRoutes = {
  auth: {
    signup: "/auth/register",
    login: "/auth/login",
  },
  user: {
    contacts: {
      getAll: "/contacts",
      create: "/contacts",
      getOne: (id) => `/contacts/get/${id}`,
      update: (id) => `/contacts/update/${id}`,
      delete: (id) => `/contacts/delete/${id}`,
      updateFavorite: (id) => `/contacts/update-favorite/${id}`,
    },
    profile: {
      get: "/user",
      update: "/user",
      profilePicture: {
        update: "/user/profile-picture/",
        delete: "/user/profile-picture/",
      },
      password: {
        reset: "/user/reset-password",
      },
    },
  },
};
