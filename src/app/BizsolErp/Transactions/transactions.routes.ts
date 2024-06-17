import { Routes } from '@angular/router'

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Transactions'
        },
        children: [
            {
                path: '',
                redirectTo: 'table',
                pathMatch: 'full'
            },
            {
                path: 'table',
                loadComponent: () => import('../Transactions/enquiry-master/table/table.component').then(m => m.TableComponent),
                data: {
                    title: 'Transactions'
                }
            },
            {
                path: 'newfollowup',
                loadComponent: () => import('../Transactions/follow-up/new-follow-up/new-follow-up.component').then(m => m.NewFollowUpComponent),
                data: {
                    title: 'New FollowUp'
                }
            },
            {
                path: 'editfollowup/:code',
                loadComponent: () => import('../Transactions/follow-up/edit-follow-up/edit-follow-up.component').then(m => m.EditFollowUpComponent),
                data: {
                    title: 'Edit FollowUp'
                }
            },
            // {
            //     path: ':Code/edit',
            //     loadComponent: () => import('../Transactions/enquiry-master/edit-lead/edit-lead.component').then(m => m.EditLeadComponent),
            //     data: {
            //         title: 'New Enquiry'
            //     }
            // },
            // {
            //     path: 'table',
            //     loadComponent: () => import('../Transactions/enquiry-master/table/table.component').then(m => m.TableComponent),
            //     data: {
            //         title: 'Leads'
            //     }
            // },
            {
                path: 'followup/:code',
                loadComponent: () => import('../Transactions/follow-up/follow-up-table/follow-up-table.component').then(m => m.FollowUpTableComponent),
                data: {
                    title: 'followUp'
                }
            },
            {
                path: 'followup-view/:code',
                loadComponent: () => import('../Transactions/follow-up/follow-up-view-table/follow-up-view-table.component').then(m => m.FollowUpViewTableComponent),
                data: {
                    title: 'followUp-view'
                }
            },
    
            {
                path: 'Route-Plan',
                loadComponent: () => import('./route-plan/route-plan.component').then(m => m.RoutePlanComponent),
                data: {
                    title: 'plan'
                }
            },
            {
                path: 'Verify-Route-Plan',
                loadComponent: () => import('./verify-route-plan/verify-route-plan/verify-route-plan.component').then(m => m.VerifyRoutePlanComponent),
                data: {
                    title: 'verify-route-plan'
                }
            },
            
        ]
    },
]