import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";



import Home from "../pages/public/Home";
import BrowseJobs from "../pages/public/BrowseJobs";
import JobDetails from "../pages/public/JobDetails";
import Freelancers from "../pages/public/Freelancers";
import FreelancerProfile from "../pages/public/FreelancerProfile";
import About from "../pages/public/About";



import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";



import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AdminHomeRedirect from "./AdminHomeRedirect";



import FreelancerDashboard from "../pages/freelancer/Dashboard";
import FreelancerProfilePage from "../pages/freelancer/Profile";
import EditProfile from "../pages/freelancer/EditProfile";
import ApplyJob from "../pages/freelancer/ApplyJob.jsx";
import MyProposals from "../pages/freelancer/MyProposals.jsx";
import MyProjects from "../pages/freelancer/MyProjects.jsx";
import HireRequests from "../pages/freelancer/HireRequests.jsx";



import ClientDashboard from "../pages/client/Dashboard";
import PostJob from "../pages/client/PostJob";
import MyJobs from "../pages/client/MyJobs.jsx";
import ClientProfile from "../pages/client/Profile.jsx";
import ClientEditProfile from "../pages/client/EditProfile.jsx";
import ClientProposals from "../pages/client/Proposals.jsx";
import ClientActiveProjects from "../pages/client/ActiveProjects.jsx";
import ReviewProject from "../pages/client/ReviewProject.jsx";
import SentInvitations from "../pages/client/SentInvitations.jsx";



import Inbox from "../pages/chat/Inbox";
import Messages from "../pages/chat/Messages";
import Notifications from "../pages/notifications/Notifications";



import HelpCenter from "../pages/public/HelpCenter";
import Contact from "../pages/public/Contact";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import TermsOfService from "../pages/public/TermsOfService";



import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import ContactMessages from "../pages/admin/ContactMessages.jsx";
import AdminUsers from "../pages/admin/Users.jsx";
import AdminJobs from "../pages/admin/Jobs.jsx";
import AdminProjects from "../pages/admin/Projects.jsx";



function NotFound() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                    Page not found
                </h1>



                <p className="mt-3 text-slate-600">
                    The page you are looking for does not exist.
                </p>
            </div>
        </main>
    );
}



function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout />}>
                    <Route
                        path="/"
                        element={
                            <AdminHomeRedirect>
                                <Home />
                            </AdminHomeRedirect>
                        }
                    />

                    <Route path="/jobs" element={<BrowseJobs />} />

                    <Route
                        path="/jobs/:id"
                        element={<JobDetails />}
                    />

                    <Route
                        path="/freelancers"
                        element={<Freelancers />}
                    />

                    <Route
                        path="/freelancers/:id"
                        element={<FreelancerProfile />}
                    />

                    <Route path="/about" element={<About />} />

                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/help-center"
                        element={<HelpCenter />}
                    />

                    <Route path="/contact" element={<Contact />} />

                    <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                    />

                    <Route
                        path="/terms-of-service"
                        element={<TermsOfService />}
                    />
                </Route>



                {/* Protected routes with public layout */}
                <Route element={<PublicLayout />}>
                    <Route element={<ProtectedRoute />}>
                        {/* Freelancer-only routes */}
                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["freelancer"]}
                                />
                            }
                        >
                            <Route
                                path="/freelancer/dashboard"
                                element={<FreelancerDashboard />}
                            />



                            <Route
                                path="/freelancer/profile"
                                element={<FreelancerProfilePage />}
                            />



                            <Route
                                path="/freelancer/edit-profile"
                                element={<EditProfile />}
                            />



                            <Route
                                path="/freelancer/apply-job/:jobId"
                                element={<ApplyJob />}
                            />



                            <Route
                                path="/freelancer/my-proposals"
                                element={<MyProposals />}
                            />



                            <Route
                                path="/freelancer/my-projects"
                                element={<MyProjects />}
                            />



                            <Route
                                path="/freelancer/hire-requests"
                                element={<HireRequests />}
                            />
                        </Route>



                        {/* Client-only routes */}
                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["client"]}
                                />
                            }
                        >
                            <Route
                                path="/client/dashboard"
                                element={<ClientDashboard />}
                            />



                            <Route
                                path="/client/post-job"
                                element={<PostJob />}
                            />



                            <Route
                                path="/client/my-jobs"
                                element={<MyJobs />}
                            />



                            <Route
                                path="/client/profile"
                                element={<ClientProfile />}
                            />



                            <Route
                                path="/client/edit-profile"
                                element={<ClientEditProfile />}
                            />



                            <Route
                                path="/client/jobs/:jobId/proposals"
                                element={<ClientProposals />}
                            />



                            <Route
                                path="/client/active-projects"
                                element={<ClientActiveProjects />}
                            />



                            <Route
                                path="/client/projects/:projectId/review"
                                element={<ReviewProject />}
                            />



                            <Route
                                path="/client/sent-invitations"
                                element={<SentInvitations />}
                            />
                        </Route>



                        {/* Shared authenticated routes */}
                        <Route
                            path="/messages"
                            element={<Inbox />}
                        />



                        <Route
                            path="/messages/:userId"
                            element={<Messages />}
                        />



                        <Route
                            path="/notifications"
                            element={<Notifications />}
                        />
                    </Route>
                </Route>



                {/* Admin-only routes */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        element={
                            <RoleRoute allowedRoles={["admin"]} />
                        }
                    >
                        <Route element={<AdminLayout />}>
                            <Route
                                path="/admin"
                                element={
                                    <Navigate
                                        to="/admin/dashboard"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />



                            <Route
                                path="/admin/contact-messages"
                                element={<ContactMessages />}
                            />

                            <Route
                                path="/admin/users"
                                element={<AdminUsers />}
                            />


                            <Route
                                path="/admin/jobs"
                                element={<AdminJobs />}
                            />


                            <Route
                                path="/admin/projects"
                                element={<AdminProjects />}
                            />


                        </Route>
                    </Route>
                </Route>



                {/* Not found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}



export default AppRoutes;