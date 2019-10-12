import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import AddSlide from '@/components/part/addSlide';
import CarouselList from '@/components/part/CarouselList';
import CommodityManage from '@/components/drawactivity/commodityManage';
import Activity from '@/components/drawactivity/activity';
import Permis from '@/components/permission/Permis';
import ViolationList from '@/components/violation/violationList';
import ReportManage from '@/components/violation/reportManage';
import Calendar from '@/components/calendar/Calendar';
import AnswerModule from '@/components/answer/answerModule';
import RandnameManage from '@/components/randname/randnameManage';
import Part from '@/components/randname/Part';
import SendBoardcast from '@/components/boardcast/sendBoardcast';
import VersionManage from '@/components/version/versionManage';
import VirtualMobile from '@/components/virtual/virtualMobile';
import VirtualNumber from '@/components/virtual/VirtualNumber';
import Chat from '@/components/chat';

Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [{
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: { path: '/addSlide', component: AddSlide },
            children: [{
                path: '/addSlide',
                component: AddSlide

            }, {
                path: '/carouselList',
                component: CarouselList

            }, {
                path: '/commodityManage',
                component: CommodityManage

            }, {
                path: '/activity',
                component: Activity

            }, {
                path: '/permis',
                component: Permis

            }, {
                path: '/violationList',
                component: ViolationList

            }, {
                path: '/reportManage',
                component: ReportManage

            }, {
                path: '/calendar',
                component: Calendar
            }, {
                path: '/answerModule',
                component: AnswerModule
            }, {
                path: '/part',
                component: Part

            }, {
                path: '/randnameManage',
                component: RandnameManage
            }, {
                path: '/sendBoardcast',
                component: SendBoardcast
            }, {
                path: '/versionManage',
                component: VersionManage
            }, {
                path: '/virtualMobile',
                component: VirtualMobile
            }, {
                path: '/virtualNumber',
                component: VirtualNumber
            }, {
                path: '/chat',
                component: Chat
            }]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('login')
        } else {
            next();
        }
    }
})

export default router;