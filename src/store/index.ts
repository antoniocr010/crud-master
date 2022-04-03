import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default new Vuex.Store({
  state: {
    isEdit: false,
    isAdd: false,
    target: 'customers',
    allCustomers: [],
    currentCustomer: {
      id: '',
      name: '',
      cpf: '',
      address: {
        cep: '',
        publicPlace: '',
        number: '',
        district: '',
        city: '',
        state: '',
      },
      contact: {
        phone: '',
        email: '',
      },
    },
  },
  mutations: {
    SET_ALLCUSTOMERS(state, data) {
      state.allCustomers = data;
    },
    SET_CURRENTCUSTOMER(state, data) {
      state.currentCustomer = data;
    },
    SET_IS_EDIT(state, data) {
      state.isEdit = data;
    },
    SET_IS_ADD(state, data) {
      state.isAdd = data;
    },
    SET_TARGET(state, data) {
      state.target = data;
    },
  },
  actions: {
    async getAllCustomers({ commit }) {
      const { data } = await axiosInstance.get('/customers');
      commit('SET_ALLCUSTOMERS', data);
    },

    async getCustomer({ commit }, id) {
      const { data } = await axiosInstance.get(`/customers/${id}`);
      commit('SET_CURRENTCUSTOMER', data);
    },

    changeCurrentCustomer({ commit }, customer) {
      commit('SET_CURRENTCUSTOMER', customer);
    },

    changeIsEdit({ commit }, value) {
      commit('SET_IS_EDIT', value);
    },

    changeIsAdd({ commit }, value) {
      commit('SET_IS_ADD', value);
    },
    
    changeTarget({ commit }, value) {
      commit('SET_TARGET', value);
    },
  },
});
