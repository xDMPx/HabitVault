import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import axios from 'axios'

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth: boolean
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { requiresAuth: true },
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/login',
            name: 'login',
            meta: { requiresAuth: false },
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            meta: { requiresAuth: false },
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/RegisterView.vue')
        }
    ]
})

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        const authorized = await axios.get('http://localhost:3000/authorized')
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
