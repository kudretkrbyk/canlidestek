import { create } from "zustand";
// const generateRandomId = () => {
//   return Math.random().toString(36).substr(2, 9);
// };

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
  liveChatList: [],
  addLiveChatList: (newMessage) =>
    set((state) => {
      const { id, sender, content, time, userName, roomId } = newMessage;
      const updatedLiveChatList = [
        ...state.liveChatList,
        {
          id,
          sender,
          message: content,
          time,
          userName,
          roomId,
        },
      ];
      // Denemek için ekledim aynı olan seriyi silecek
      const uniqueLiveChatList = updatedLiveChatList.filter(
        (message, index, self) =>
          index ===
          self.findIndex(
            (m) =>
              m.customerId === message.customerId &&
              m.supportId === message.supportId &&
              m.chatId === message.chatId &&
              m.sender === message.sender &&
              m.message === message.message
          )
      );

      return {
        liveChatList: uniqueLiveChatList,
        // Diğer state'leri güncelle
      };
    }),
  customerMatchId: [],
  addCustomerMatch: (newMatch) =>
    set((state) => ({
      customerMatchId: [...state.customerMatchId, newMatch],
    })),

  supportId: 1, // Varsayılan olarak 1, ihtiyaca göre değiştirilebilir

  // Yeni state'i güncelleyen fonksiyon
  setSupportId: (newSupportId) =>
    set((state) => ({
      ...state,
      supportId: newSupportId,
    })),
  selectedCustomer: "", // Varsayılan olarak 1, ihtiyaca göre değiştirilebilir

  // Yeni state'i güncelleyen fonksiyon
  setSelectedCustomer: (newSupportId) =>
    set((state) => ({
      ...state,
      supportId: newSupportId,
    })),

  setCustomerInfo: (newInfo) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...newInfo },
    })),
  customerWaitingList: [],
  setCustomerWaitingList: (newMessage) =>
    set((state) => ({
      ...state,
      customerWaitingList: [...state.customerWaitingList, newMessage],
    })),
}));

export default customerMessageStore;
