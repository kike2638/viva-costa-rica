import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = { email: string; name: string; role: 'superadmin' }

type State = {
  user: User | null
  isAuthenticated: boolean
  login: (email:string, pass:string) => boolean
  logout: () => void
}

// credenciales demo SuperAdmin
const SUPER = { email:'admin@vivacostarica.com', pass:'Terra2026', name:'SuperAdmin Terra' }

export const useAuthStore = create<State>()(persist((set)=> ({
  user: null,
  isAuthenticated: false,
  login: (email, pass) => {
    if(email===SUPER.email && pass===SUPER.pass){
      set({ user:{ email:SUPER.email, name:SUPER.name, role:'superadmin'}, isAuthenticated:true })
      return true
    }
    return false
  },
  logout: () => set({ user:null, isAuthenticated:false }),
}), { name:'terra-auth' }))

