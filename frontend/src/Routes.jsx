import React, { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

import Dashboard from './components/dashboard/Dashboard'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Profile from './components/user/Profile'

import { useAuth } from './authContext'

const ProjectRoutes = () => {
const { currUser, setCurrUser } = useAuth();
  const navigate = useNavigate();


  const location = useLocation();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage && !currUser) {
      setCurrUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/auth", "/signup"].includes(location.pathname)) {
      navigate('/auth');
    } else if (userIdFromStorage && location.pathname === '/auth') {
      navigate('/');
    }
  }, [currUser, navigate, setCurrUser, location.pathname]);


  let element = useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/auth',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/profile',
      element: <Profile />
    }
  ]);
  return element;
}

export default ProjectRoutes;