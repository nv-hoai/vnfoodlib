import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from './components';
import AuthLayout from './components/layout/AuthLayout';
import { AuthInitializer } from './features/auth/components';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MealSchedulingPage from './pages/MealSchedulingPage';
import CollectionsPage from './pages/CollectionsPage';

const App: FC = () => {
  return (
    <AuthInitializer>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path='/register' element={<AuthLayout><RegisterPage /></AuthLayout>} />

          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/meal-scheduling' element={<MealSchedulingPage />} />
            <Route path='/collections' element={<CollectionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthInitializer>
  );
};

export default App;