import {
	createRouter,
	createWebHistory,
} from 'vue-router';

const router=createRouter({
	history:createWebHistory(),
	routes:[
		{
			path:'/',
			name:'index',
			component:()=>import('@/routes/Index.vue'),
		},
	],
});

export default router;
