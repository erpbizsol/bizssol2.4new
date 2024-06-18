import { Routes } from '@angular/router'
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Master'
        },
        children: [
            {
                path: '',
                redirectTo: 'table',
                pathMatch: 'full'
            },
            // {
            //     path: 'login',
            //     loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
            //     // data: {
            //     //     title: 'Login Page'
            //     // }
            // },
            // {
            //     path: 'register',
            //     loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
            //     // data: {
            //     //     title: 'Register Page'
            //     // }
            // },
            // {
            //     path: 'existing',
            //     loadComponent: () => import('./enquiry-master/lead-form/lead-form.component').then(m => m.LeadFormComponent),
            //     data: {
            //         title: 'Enquiry'
            //     }
            // },
            {
                path: ':Code/new',
                loadComponent: () => import('../Transactions/enquiry-master/new-customer/new-customer.component').then(m => m.NewCustomerComponent),
                data: {
                    title: 'New Enquiry'
                }
            },
            {
                path: ':Code/history',
                loadComponent: () => import('../Transactions/enquiry-master/history/history.component').then(m => m.HistoryComponent),
            },
            {
                path: 'country',
                loadComponent: () => import('./country-table/country-table.component').then(m => m.CountryTableComponent),
                data: {
                    title: 'country master'
                }
            },
            {
                path: 'state',
                loadComponent: () => import('./state-table/state-table.component').then(m => m.StateTableComponent),
                data: {
                    title: 'state master'
                }
            },
            {
                path: 'city',
                loadComponent: () => import('./city-table/city-table.component').then(m => m.CityTableComponent),
                data: {
                    title: 'city master'
                }
            },
            {
                path: 'chemical',
                loadComponent: () => import('./chemical/chemical.component').then(m => m.ChemicalComponent),
                data: {
                    title: 'chemical master'
                }
            },
            {
                path: 'uom',
                loadComponent: () => import('./uom/uom.component').then(m => m.UomComponent),
                data: {
                    title: 'uom Enquiry'
                }
            },
            {
                path: 'department',
                loadComponent: () => import('./department/department.component').then(m => m.DepartmentComponent),
                data: {
                    title: 'department Enquiry'
                }
            },
            {
                path: 'tank-Configuration',
                loadComponent: () => import('./tank-configuration/tank-configuration.component').then(m => m.TankConfigurationComponent),
                data: {
                    title: 'tank-configuration'
                }
            },
            {
                path: 'tank-daily-stock',
                loadComponent: () => import('./tank-daily-stock/tank-daily-stock.component').then(m => m.TankDailyStockComponent),
                data: {
                    title: 'tank-daily-stock'
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
            {
                path: 'table',
                loadComponent: () => import('../Transactions/enquiry-master/table/table.component').then(m => m.TableComponent),
                data: {
                    title: 'Leads'
                }
            },
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
                path: 'Heat Treatment',
                loadComponent: () => import('./heat-treatment/heat-treatment.component').then(m => m.HeatTreatmentComponent),
                data: {
                    title: 'Heat-Treatment'
                }
            },

            {
                path: 'PaymentTermsMaster',
                loadComponent: () => import('./payment-term-master/payment-term-master.component').then(m => m.PaymentTermMasterComponent),
                data: {
                    title: 'Payment-Term-Master'
                }
            },
            {
                path: 'Route-Plan',
                loadComponent: () => import('../Transactions/route-plan/route-plan.component').then(m => m.RoutePlanComponent),
                data: {
                    title: 'plan'
                }
            },
            {
                path: 'Verify-Route-Plan',
                loadComponent: () => import('../Transactions/verify-route-plan/verify-route-plan/verify-route-plan.component').then(m => m.VerifyRoutePlanComponent),
                data: {
                    title: 'verify-route-plan'
                }
            },

            {
                path: 'Bank-Master',
                loadComponent: () => import('../Masters/bank-master/bank-master.component').then(m => m.BankMasterComponent),
                data: {
                    title: 'bank'
                }
            },
            {
                path: 'HSN-Code-Master',
                loadComponent: () => import('./hsn-code-component/hsn-code-component.component').then(m => m.HSNCodeMasterComponent),
                data: {
                    title: 'HSN-Code-Master'
                }
              },

        ]
    },
]