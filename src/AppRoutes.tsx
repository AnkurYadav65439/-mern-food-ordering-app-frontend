import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layouts/Layout.tsx"
import HomePage from "./pages/HomePage.tsx"
import AuthCallbackPage from "./pages/AuthCallbackPage.tsx"
import UserProfilePage from "./pages/UserProfilePage.tsx"
import ProtectedRoute from "./auth/ProtectedRoute.tsx"
import ManageRestaurantPage from "./pages/ManageRestaurantPage.tsx"
import SearchPage from "./pages/SearchPage.tsx"
import DetailPage from "./pages/DetailPage.tsx"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout showHero><HomePage /></Layout>}></Route>
            <Route path="/auth-callback" element={<AuthCallbackPage />}></Route>
            <Route path="/search/:city" element={<Layout><SearchPage /></Layout>}></Route>
            <Route path="/detail/:restaurantId" element={<Layout><DetailPage /></Layout>}></Route>
            {/* protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/user-profile"
                    element={<Layout><UserProfilePage /></Layout>}>
                </Route>
                <Route
                    path="/manage-restaurant"
                    element={<Layout><ManageRestaurantPage /></Layout>}>
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
    )
}

export default AppRoutes