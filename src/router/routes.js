import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import profileProfile from '../views/profile.vue'
import explore from '../views/explore.vue'
import stationDetails from '../views/station-details.vue'
import stationCreate from '../views/station-create.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/profile',
        name: 'profile',
        component: profileProfile
    },
    {
        path: '/explore/:genre',
        name: 'explore',
        component: explore
    },
    {
        path: '/create',
        name: 'create station',
        component: stationCreate
    },
    {
        path: '/details/:stationName',
        name: 'details',
        component: stationDetails
    },
]

const router = new VueRouter({
    routes
})

export default router