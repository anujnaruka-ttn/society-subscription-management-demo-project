const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const apis = {
    user: BASE_URL + '/user',
    subscription: BASE_URL + '/subscriptions',
    payment: BASE_URL + '/payment',
    flat: BASE_URL + '/flats',
}

const apiMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

const authApis = {
    login: apis.user + '/auth/login',
    signup: apis.user + '/auth/register',
    loginGoogle: apis.user + '/auth/login-google',
    changePassword: apis.user + '/change-password',
    changeProfile: apis.user + '/change-profile',
    updateProfile: apis.user + '/update-profile',
}

const adminApis = {
    getSubscriptions: apis.subscription + '/',
    updateSubscriptionRate: apis.subscription + '/update-monthly-rate',
    getResidents: apis.flat + '/residents'
}

export {
    apis,
    apiMethods,
    authApis,
    adminApis
}