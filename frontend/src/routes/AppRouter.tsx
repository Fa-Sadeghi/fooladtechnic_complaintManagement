import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';

import ComplaintList from '../pages/complaints/ComplaintList';
import ComplaintCreate from '../pages/complaints/ComplaintCreate';
import ComplaintDetails from '../pages/complaints/ComplaintDetails';
// import NotFound from '../pages/NotFound';

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    path="/"
                    element={<Navigate to="/complaints" replace />}
                />

                <Route
                    path="/complaints"
                    element={<ComplaintList />}
                />

                <Route
                    path="/complaints/create"
                    element={<ComplaintCreate />}
                />

                <Route
                    path="/complaints/:id"
                    element={<ComplaintDetails />}
                />
            </Route>

            {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
    );
}

export default AppRouter;