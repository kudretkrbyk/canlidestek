import { create } from "zustand";

const authStore = create((set) => ({
  supporterId: null, // Kullanıcı ID'si, başlangıçta null olarak ayarlanır
  isLoggedIn: false, // Kullanıcının oturum açıp açılmadığını belirten bir bayrak
  login: (supporterId) => set({ supporterId, isLoggedIn: true }), // Oturum açma işlemi
  logout: () => set({ supporterId: null, isLoggedIn: false }), // Oturum kapatma işlemi
}));

export default authStore;
