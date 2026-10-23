import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function PublicLayout() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100">
            {/* Subtle background accents */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-200/20 blur-3xl" />

                <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-sky-100/40 blur-3xl" />

                <div className="absolute -left-20 bottom-24 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default PublicLayout;