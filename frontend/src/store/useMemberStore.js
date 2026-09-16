import { create } from 'zustand';
import api from '../api/axios';

const useMemberStore = create((set, get) => ({
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,

  fetchMembers: async (searchQuery = '', statusFilter = '') => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      params.append('limit', '100'); // changed from 1000 to 100 to pass validation
      
      const url = `/members?${params.toString()}`;
      const response = await api.get(url);
      set({ members: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch members', isLoading: false });
    }
  },

  fetchMemberDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/members/${id}`);
      set({ 
        currentMember: {
          ...response.data.data.member,
          latestPayment: response.data.data.latestPayment
        }, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch member details', isLoading: false });
    }
  },

  createMember: async (memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/members', memberData);
      set((state) => ({ 
        members: [response.data.data.member, ...state.members],
        isLoading: false 
      }));
      return response.data.data.member;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create member', isLoading: false });
      throw error;
    }
  },

  updateMember: async (id, memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/members/${id}`, memberData);
      set((state) => {
        const isCurrent = state.currentMember?.id === id;
        return {
          currentMember: isCurrent ? { ...state.currentMember, ...response.data.data } : state.currentMember,
          members: state.members.map(m => m.id === id ? { ...m, ...response.data.data } : m),
          isLoading: false
        };
      });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update member', isLoading: false });
      throw error;
    }
  },

  deleteMember: async (id) => {
    // We don't set global isLoading=true here so we don't unmount MemberDetails component prematurely.
    // The DeleteMemberModal has its own isDeleting state.
    try {
      await api.delete(`/members/${id}`);
      set((state) => ({
        members: state.members.filter(m => m.id !== id),
        // Don't set currentMember to null yet, let the success modal show first.
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete member' });
      throw error;
    }
  },

  recordPayment: async (id, paymentData) => {
    try {
      const response = await api.post(`/members/${id}/payments`, paymentData);
      set((state) => {
        const isCurrent = state.currentMember?.id === id;
        return {
          currentMember: isCurrent ? { ...state.currentMember, ...response.data.data.member } : state.currentMember,
          members: state.members.map(m => m.id === id ? { ...m, ...response.data.data.member } : m),
        };
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));

export default useMemberStore;
