export const END_POINT = "https://fdc0-2001-448a-20a0-f164-29a3-5fa7-7583-da43.ngrok-free.app";
export const SECRET = "indekossecret";
export const SERVICE_WORKER = "/serviceworker.js"
export const WEB_CACHE = ["indkost-cache-data", "indkost-cache-v1"];

// ====================================== CONSTANT =======================================
export const Event = {
    timeout: 1500
}

export const Constant = {
    image: {
        maxSize: 1, // in MB
        dividersImageSizeByteToMB: 1048576,
    },
    serviceRequestStatus: {
        REJECTED: "Ditolak",
        SUBMITTED: "Menunggu Konfirmasi",
        ACCEPTED: "Dalam Pengerjaan",
        COMPLETED: "Selesai"
    },
    userAttribute: {
        maritalStatus: {
            MARRIED: "Menikah",
            SINGLE: "Lajang"
        },
        gender: {
            LAKILAKI: "Laki-laki",
            PEREMPUAN: "Perempuan"
        }
    },
    modalType: {
        FORM: "form",
        DELETECONFIRMATION: "delete"
    },
    httpStatus: {
        ERROR: "error",
        SUCCESS: "success",
        WARNING: "warning",
        UNKNOWN: "unknown",
        INFO: "info"
    },
    role: {
        OWNER: "Owner",
        ADMIN: "Admin",
        TENANT: "Tenant"
    },
    roomDetailsCategory: {
        KAMAR_TIDUR: "Kamar Tidur",
        KAMAR_MANDI: "Kamar Mandi",
        FURNITURE: "Furniture",
        ALAT_ELEKTRONIK: "Alat Elektronik",
        FASILITAS_KAMAR_LAINNYA: "Fasilitas Kamar Lainnya"
    },
    serviceCategory: {
        LAUNDRY: "Laundry",
        PEMBERSIHAN_KAMAR: "Pembersihan Kamar",
        PERBAIKAN_FASILITAS: "Perbaikan Fasilitas",
        LAYANAN_LAINNYA: "Layanan Lainnya"
    },
    roomStatus: {
        KOSONG: "Kosong",
        TERSEDIA: "Tersedia",
        PENUH: "Penuh",
        RESERVED: "Disewa Pribadi",
        FAMILY_RESERVERED: "Disewa Pasutri"
    }, 
    requestListType: {
        TODO: "ToDO"
    }
}

export const PAGE = {
    HOME: "/home.html",
    LOGIN: "/login.html",
    PROFILE: "/profile.html",
    
    ROOMLIST: '/listuser.html',
    CREATEUSER: '/registeruser.html',
    USERLIST:'/listuser.html',
    EDITUSER: (userId) => `/edituser.html?id=${userId}`,
    USERDETAIL: '/userdetail.html?id=',

    ANNOUNCEMENTMENU: "/announcementmenu.html", 
    ANNOUNCEMENTDETAIL: "/announcementdetail.html?id=",
    
    CREATEANNOUNCEMENT: "/createannouncement.html",
    EDITANNOUNCEMENT: "/editannouncement.html?id=",
    EDITCONTACTABLE: "/editcontactable.html?id=",
    
    SERVICE: "/service.html",
    SERVICEREQUEST: "/servicerequest.html",
    REQUESTHISTORY: "/requesthistory.html",
    TASKDETAIL: (taskId) => `/taskdetail.html?id=${taskId}`,

    ROOMLIST: '/roomlist.html',
    ROOMDETAIL: '/roomdetail.html?id=',
    EDITROOM: '/editroom.html?id=',

    PAYMENT: "/payment.html",
    PAYMENTDETAIL: (paymentId) => `/paymentdetails.html?id=${paymentId}`,
    PAYMENTMETHOD: (transactionId) => `/paymentmethod.html?id=${transactionId}`
};

export const CONTENT_TYPE = {
    FORM: "multipart/form-data"
}

export const TOKENS = {
    REMEMBERME: "token",
    USERID : "id"
}

// ====================================== END POINT ======================================
export const ServiceURL = {
    MasterData: {
        getIndekos: "/main",
        getRole: "/role",
        getRoomDetailCategory: "/room/category",
        getServiceCategory: "/service/category"
    },
    Account: {
        getAll: "/account/all",
        getById: (id) => `/account/${id}`,
        getByUsername: (username) => `/account?username=${username}`
    },
    User: {
        getAll: (roomId) => `/user?room=${roomId}`,
        getById: (id) => `/user/${id}`,
        register: "/user",
        update: (id) => `/user/${id}`,
        delete: (id, requester) => `/user/${id}?requester=${requester}`,

        // User account
        login: "/user/login",
        changePassword: `/user/changepassword`,
        forgotPassword: "/user/resetpassword",
        logout: (id) => `/user/logout?user=${id}`,

        // User Document
        removeUserDocument: (id) => `/user/${id}/document`,

        // User Setting
        getUserSetting: (id) => `/user/${id}/settings`,
        updateUserSetting: (id) => `/user/${id}/settings`,

        // Contactable Person
        getContactable: (id) => `/user/${id}/contactable?person=`,
        addContactable: (id) => `/user/${id}/contactable`,
        editContactable: (id) => `/user/${id}/contactable?person=`,
        deleteContactable: (id) => `/user/${id}/contactable?person=`
    },
    Room: {
        getAll: "/room",
        getAllAvailable: "/room/available",
        getById: (id) => `/room/${id}`,
        create: "/room",
        update: (id) => `/room/${id}`,
        delete: (id, requester) => `/room/${id}?requester=${requester}`,

        // Room Details
        getDetail: (id) => `/room/${id}/details`,
        addDetail: (id) => `/room/${id}/details`,
        editDetail: (id) => `/room/${id}/details?edit=`,
        removeDetail: (id, detailId, requester) => `/room/${id}/details?delete=${detailId}&requester=${requester}`,

        // Room Price Detail
        getPrice: (id) => `/room/${id}/prices`,
        addPrice: (id) => `/room/${id}/prices`,
        editPrice: (id) => `/room/${id}/prices?edit=`,
        removePrice: (id, detailId, requester) => `/room/${id}/prices?delete=${detailId}&requester=${requester}`
    },
    Service: {
        getAll: "/service",
        getById: (id) => `/service/${id}`
    },
    Task: {
        create: "/task",
        update: (id) => `/task/${id}`,
        getAll: (requestor, type) => `/task?requestor=${requestor}&type=${type}`,
        getById: (id) => `/task/${id}`,
    },
    Payment: {
        create: "/payment/pay"
    },
    Announcement: {
        getAll: "/announcement",
        getById: (id) => `/announcement/${id}`,
        create: "/announcement",
        update: (id) => `/announcement/${id}`,
        delete: (id) => `/announcement/${id}`
    },
    Transaction: {
        unpaid: (id) => `/transaction/unpaid/${id}`,
        create: "/transaction",    
        getAll: (id) => `/transaction?requestor=${id}`,
        get: (id) => `/transaction/${id}`
    },
    Notification:{
        getKey: "/notification/key",
        subs: "/notification/subscribe",
        unsub: (id) => `/notification/unsubscribe/${id}`,
        getAll : (id) => `/notification/${id}`,
        read: (id) => `/notification/${id}`
    }
}