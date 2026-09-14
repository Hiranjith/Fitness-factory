import { create } from 'zustand';
import api from '../api/axios';

const usePlanStore = create((set, get) => ({
  plans: [],
  isLoading: false,
  error: null,

  fetchPlans: async (searchQuery = '') => {
    set({ isLoading: true, error: null });
    try {
      const url = searchQuery ? `/plans?search=${encodeURIComponent(searchQuery)}` : '/plans';
      const response = await api.get(url);
      set({ plans: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch plans', isLoading: false });
    }
  },

  createPlan: async (planData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/plans', planData);
      set((state) => ({ 
        plans: [...state.plans, response.data.data],
        isLoading: false 
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create plan', isLoading: false });
      throw error;
    }
  },

  updatePlan: async (id, planData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/plans/${id}`, planData);
      set((state) => ({
        plans: state.plans.map(plan => plan.id === id ? response.data.data : plan),
        isLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update plan', isLoading: false });
      throw error;
    }
  },

  deletePlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/plans/${id}`);
      set((state) => ({
        plans: state.plans.filter(plan => plan.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete plan', isLoading: false });
      throw error;
    }
  },

  deactivatePlan: async (id, currentStatus) => {
    const newStatus = !currentStatus;
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/plans/${id}`, { is_active: newStatus });
      set((state) => ({
        plans: state.plans.map(plan => plan.id === id ? response.data.data : plan),
        isLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || `Failed to ${newStatus ? 'activate' : 'deactivate'} plan`, isLoading: false });
      throw error;
    }
  }
}));

export default usePlanStore;
