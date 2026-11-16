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

  const normalizePlot = (p) => {
    if (!p) return null;
    return {
      ...p,
      plot_name: p.plot_name || p.plotName || 'Farmland Plot',
      area_value: p.area_original !== undefined && p.area_original !== null
        ? p.area_original
        : (p.area !== undefined && p.area !== null ? p.area : p.area_acres),
      area_unit: p.area_unit || p.unit || 'acres',
      soil_type: p.soil_type || p.soilType || 'Alluvial',
      soil_ph: p.soil_ph !== undefined && p.soil_ph !== null ? p.soil_ph : (p.soilPh ?? 7.0),
      irrigation_source: p.irrigation_source || p.irrigationSource || 'Canal',
      water_availability: p.water_availability || p.waterAvailability || 'Moderate',
      current_crop: p.current_crop || p.currentCrop || 'Paddy',
      previous_crop: p.previous_crop || p.previousCrop || '',
      planned_crop: p.planned_crop || p.plannedCrop || '',
      sowing_date: p.sowing_date || p.sowingDate || '',
      estimated_budget: p.estimated_budget !== undefined && p.estimated_budget !== null
        ? p.estimated_budget
        : (p.estimatedBudget !== undefined ? p.estimatedBudget : (p.budget ?? 25000))
    };
  };

  const refreshPlots = async () => {
    if (!user) {
      setPlots([]);
      setActivePlot(null);
      return [];
    }
    try {
      const res = await api.listPlots();
      const rawPlots = res.plots || (Array.isArray(res) ? res : []);
      const plotList = rawPlots.map(normalizePlot);
      setPlots(plotList);
      if (plotList.length > 0) {
        const active = plotList.find(p => p.is_active || p.isActive) || plotList[0];
        setActivePlot(active);
      } else {
        setActivePlot(null);
      }
      return plotList;
    } catch (err) {
      console.warn('[Plots Load Warning]', err);
      setPlots([]);
      setActivePlot(null);
      return [];
    }
  };

  // Fetch plots whenever user changes
  useEffect(() => {
    if (user) {
      refreshPlots();
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
    const normalized = normalizePlot(newPlot);
    setPlots(prev => [normalized, ...prev]);
    setActivePlot(normalized);
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
      addPlotToState,
      refreshPlots
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
