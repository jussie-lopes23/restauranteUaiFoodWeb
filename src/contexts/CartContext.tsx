import React, { createContext, useReducer, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; // Importa o TIPO separadamente
import { toast } from 'react-hot-toast';

// --- 1. Definição de Tipos ---

// O tipo de UM item dentro do carrinho
export interface CartItem {
  id: string;
  description: string;
  unitPrice: number; // Vamos guardar como número
  quantity: number;
}

// O estado do nosso carrinho
interface CartState {
  items: CartItem[];
}

// As ações que podemos tomar no carrinho
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STATE'; payload: CartState }; // Para carregar do localStorage

// O que o nosso Contexto vai fornecer
interface CartContextData {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // (Funções úteis que podemos adicionar depois)
  totalPrice: () => number;
  totalItems: () => number;
}

// --- 2. O Reducer (A Lógica do Carrinho) ---

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((i) => i.id === action.payload.id);
      if (existingItem) {
        // Se o item já existe, apenas aumenta a quantidade
        //toast.success(`${action.payload.description} adicionado ao carrinho!`);
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      } else {
        // Se for um novo item
        //toast.success(`${action.payload.description} adicionado ao carrinho!`);
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }

    case 'REMOVE_ITEM': {
      toast.error('Item removido do carrinho.');
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    }

    case 'UPDATE_QUANTITY': {
      // Se a quantidade for 0 ou menos, remove o item
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: action.payload.id } });
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    case 'SET_STATE': // Para carregar do localStorage
      return action.payload;

    default:
      return state;
  }
}

// --- 3. Criação do Contexto e Provider ---

const initialState: CartState = {
  items: [],
};

export const CartContext = createContext({} as CartContextData);

interface CartProviderProps {
  children: ReactNode;
}

// A Key para o localStorage
const STORAGE_KEY = '@UaiFood:cart';

export function CartProvider({ children }: CartProviderProps) {
  // Usamos useReducer em vez de useState
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    // Tenta carregar o estado inicial do localStorage
    try {
      const storedCart = localStorage.getItem(STORAGE_KEY);
      return storedCart ? (JSON.parse(storedCart) as CartState) : initial;
    } catch (error) {
      console.error("Falha ao carregar carrinho:", error);
      return initial;
    }
  });

  // Salva no localStorage sempre que o 'state' mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // --- 4. Funções que os componentes vão chamar ---

  const addItem = (item: CartItem) => {

    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      toast.success(`Mais um "${item.description}" adicionado!`);
    } else {
      toast.success(`"${item.description}" adicionado ao carrinho!`);
    }
    
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Funções auxiliares
  const totalPrice = () => {
    return state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  };
  
  const totalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- 5. Hook Personalizado (Atalho) ---
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider.');
  }
  return context;
}