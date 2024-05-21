import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL


export const enum UserType {
    Unknown,
    Normal,
    Admin
}

declare module 'vue-router' {
    interface RouteMeta {
        requiredUserType: UserType
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                requiredUserType: UserType.Normal
            },
            components: { AuthorizedView: () => import('../views/HomeView.vue') }
        },
        {
            path: '/habit/:id',
            name: 'habit',
            meta: {
                requiredUserType: UserType.Normal
            },
            components: { AuthorizedView: () => import('../views/HabitView.vue') }

        },
        {
            path: '/login',
            name: 'login',
            meta: {
                requiredUserType: UserType.Unknown
            },
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            meta: {
                requiredUserType: UserType.Unknown
            },
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            meta: {
                requiredUserType: UserType.Admin
            },
            components: { AdminView: () => import('../views/AdminView.vue') }
        },
    ]
})

router.beforeEach(async (to) => {
    if (to.meta.requiredUserType == UserType.Admin) {
        const authorized = await axios.get('/adminAuthorized')
            .then(() => true)
            .catch(() => false)
        if (!authorized) {
            return {
                path: '/',
            }
        }
    }
    else if (to.meta.requiredUserType == UserType.Normal) {
        const authorized = await axios.get('/authorized')
            .then(() => true)
            .catch(() => false)
        if (!authorized) {
            return {
                path: '/login',
            }
        }
    }
})

export default router
