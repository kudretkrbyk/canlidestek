import { create } from "zustand";

const customerMessageStore = create((set) => ({
  customerMessages: [],
  liveCustomerMessages: [],
  fullCustomerMessages: [],
  addCustomerMessage: (newMessage) =>
    set((state) => ({
      customerMessages: [...state.customerMessages, newMessage],
      fullCustomerMessages: [...state.fullCustomerMessages, newMessage],
    })),
  addLiveCustomerMessage: (newMessage) =>
    set((state) => ({
      liveCustomerMessages: [...state.liveCustomerMessages, newMessage],
      fullCustomerMessages: [...state.fullCustomerMessages, newMessage],
    })),
}));

export default customerMessageStore;
