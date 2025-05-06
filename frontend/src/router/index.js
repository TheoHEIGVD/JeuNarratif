import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import StoryView from "@/views/StoryView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            // Page d'accueil (protégée)
            path: "/",
            name: "home",
            component: HomeView,
            meta: { requiresAuth: true },
        },

        // Pages d'authentification (visiteurs uniquement)
        {
            path: "/login",
            name: "login",
            component: LoginForm,
            meta: { requiresGuest: true },
        },
        {
            path: "/register",
            name: "register",
            component: RegisterForm,
            meta: { requiresGuest: true },
        },
        // Pages de jeu (protégées)

        {
            path: "/story/:id",
            name: "story",
            component: StoryView,
            meta: { requiresAuth: true },
        },
        {
            path: "/chapter/:id",
            name: "chapter",
            component: () => import("../views/ChapterView.vue"),
            props: true,
        },
    ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    // Redirection selon l'état d'authentification
    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login");
        next("/login"); // Redirection vers login si non authentifié
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next("/"); // Redirection vers home si déjà connecté
    } else {
        next();// Navigation autorisée
    }
});

export default router;
