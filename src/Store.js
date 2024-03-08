import { create } from "zustand";

const customerMessageStore = create((set) => ({
  customerMessages: [],
  addCustomerMessage: (newMessage) =>
    set((state) => ({
      customerMessages: [...state.customerMessages, newMessage],
      fullCustomerMessages: [...state.fullCustomerMessages, newMessage],
    })),
  liveCustomerMessages: [],
  addLiveCustomerMessage: (newMessage) =>
    set((state) => ({
      liveCustomerMessages: [...state.liveCustomerMessages, newMessage],
      fullCustomerMessages: [...state.fullCustomerMessages, newMessage],
    })),
  fullCustomerMessages: [],
  supportAgentMessages: [],
  addSupportAgentMessages: (newMessage) =>
    set((state) => ({
      supportAgentMessages: [...state.supportAgentMessages, newMessage],
    })),
}));

export default customerMessageStore;
