const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const apis = {
    user: BASE_URL + '/user',
    subscription: BASE_URL + '/subscriptions',
    payment: BASE_URL + '/payments',
    flat: BASE_URL + '/flats',
    billing: BASE_URL + '/billing',
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
    getResidents: apis.flat + '/residents',
    getFlats: apis.flat + '/',
    addFlat: apis.flat + '/add-flat',
    deleteFlat: (id: string) => apis.flat + '/' + id,
    billing: apis.billing + '/',
    billingByMonth: (month: number, year: number) => apis.billing + `/month?month=${month}&year=${year}`,
    verifyPayment: (id: string) => apis.billing + `/${id}/verify-payment`,
    updateBillingStatusCall: (id: string) => apis.billing + `/${id}/update-status`,
    deleteBillingRecord: (id: string) => apis.billing + `/delete/${id}`,
    getPaymentEntries: apis.payment + '/entries',
    recordPayment: apis.payment + '/record',
    getPendingPayments: apis.payment + '/pending',
}

const residentApis = {
    getResidentSubscriptions: apis.subscription + '/details',
    getResidentSubscriptionsByMonth: (month: string) => apis.subscription + `/details/${month}`,
    updatePaymentStatus: apis.subscription + '/update-payment-status',
}

export {
    apis,
    apiMethods,
    authApis,
    adminApis,
    residentApis
}