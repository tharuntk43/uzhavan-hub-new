import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('uzhavan_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [plots, setPlots] = useState([]);
  const [activePlot, setActivePlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load user profile & plots if session exists
  useEffect(() => {
    const token = localStorage.getItem('uzhavan_token');
    if (token && !user) {
      api.getMe().then(res => {
        if (res && res.user) {
          setUser(res.user);
          localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
        }
      }).catch(() => {
        // Token expired or invalid
        localStorage.removeItem('uzhavan_token');
        localStorage.removeItem('uzhavan_user');
      });
    }
  }, []);

  // Fetch plots whenever user changes
  useEffect(() => {
    if (user) {
      api.getPlots().then(res => {
        const plotList = res.plots || (Array.isArray(res) ? res : []);
        setPlots(plotList);
        if (plotList.length > 0) {
          const active = plotList.find(p => p.is_active || p.isActive) || plotList[0];
          setActivePlot(active);
        } else {
          setActivePlot({
            id: 'default_plot',
            plot_name: 'Vadakku Kadu (North Field)',
            area_value: 3.5,
            area_unit: 'acres',
            soil_type: 'red',
            soil_ph: 6.8,
            irrigation_source: 'borewell',
            water_availability: 'Moderate',
            current_crop: 'Cotton & Black Gram'
          });
        }
      }).catch(() => {
        setActivePlot({
          id: 'default_plot',
          plot_name: 'Vadakku Kadu (North Field)',
          area_value: 3.5,
          area_unit: 'acres',
          soil_type: 'red',
          soil_ph: 6.8,
          irrigation_source: 'borewell',
          water_availability: 'Moderate',
          current_crop: 'Cotton & Black Gram'
        });
      });
    } else {
      setPlots([]);
      setActivePlot(null);
    }
  }, [user]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await api.login({ identifier, password });
      if (res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('uzhavan_token', res.token);
        localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
        showToast('Login successful! Welcome to Uzhavan Hub.', 'success');
        return true;
      }
      throw new Error(res.error || 'Authentication failed');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (persona = 'murugan') => {
    setLoading(true);
    try {
      const res = await api.demoLogin(persona);
      if (res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('uzhavan_token', res.token);
        localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
        showToast(`Logged in as verified demo farmer ${res.user.fullName || res.user.full_name}`, 'success');
        return true;
      }
      throw new Error(res.error || 'Demo login failed');
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (onboardingData) => {
    setLoading(true);
    try {
      const res = await api.register(onboardingData);
      if (res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('uzhavan_token', res.token);
        localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
        showToast('Farmer profile and farm plots registered successfully!', 'success');
        return true;
      }
      throw new Error(res.error || 'Registration failed');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    setUser(null);
    setPlots([]);
    setActivePlot(null);
    localStorage.removeItem('uzhavan_token');
    localStorage.removeItem('uzhavan_user');
    showToast('You have been logged out safely.', 'info');
  };

  const switchActivePlot = (plotId) => {
    const found = plots.find(p => p.id === plotId);
    if (found) {
      setActivePlot(found);
      showToast(`Switched active farm plot to ${found.plot_name}`, 'info');
    }
  };

  const addPlotToState = (newPlot) => {
    setPlots(prev => [newPlot, ...prev]);
    setActivePlot(newPlot);
  };

  return (
    <AuthContext.Provider value={{
      user,
      plots,
      activePlot,
      loading,
      toast,
      showToast,
      login,
      demoLogin,
      register,
      logout,
      switchActivePlot,
      addPlotToState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
