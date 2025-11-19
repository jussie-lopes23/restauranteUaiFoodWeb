import React, { createContext, useReducer, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  description: string;
  unitPrice: number; 
  quantity: number;
}


interface CartState {
  items: CartItem[];
}


type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STATE'; payload: CartState }; 


interface CartContextData {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}


function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((i) => i.id === action.payload.id);
      if (existingItem) {
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
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider.');
  }
  return context;
}