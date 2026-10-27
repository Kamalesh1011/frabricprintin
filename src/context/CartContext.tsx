import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Product,
  SizeOptionType,
  PrintOptions,
  ApparelProduct,
  ApparelColor,
  PrintPlacement,
  JerseyCustomization
} from '../types';

export interface AddToCartExtraOptions {
  meters?: number;
  selectedFabricVariant?: string;
  sizeBreakdown?: Record<string, number>;
  customPreviewUrl?: string;
  apparelProduct?: ApparelProduct;
  apparelColor?: ApparelColor;
  printPlacement?: PrintPlacement;
  jerseyCustomization?: JerseyCustomization;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters?: number,
    selectedFabricVariant?: string,
    extraOptions?: AddToCartExtraOptions
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  updateSizeBreakdown: (cartItemId: string, sizeBreakdown: Record<string, number>) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const legacy = localStorage.getItem('texprint_cart');
      if (legacy) localStorage.removeItem('texprint_cart');
      const saved = localStorage.getItem('fabricprint_cart') || legacy;
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('fabricprint_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const calculateUnitAndItemPrice = (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters: number = 1,
    selectedFabricVariant?: string
  ) => {
    let basePrice = 0;
    let printSurcharge = 0;

    if (sizeType === 'apparel') {
      basePrice = product.price_per_meter;
      // Volume discount calculation for apparel if applicable
      if (quantity >= 50) {
        basePrice = basePrice * 0.8; // 20% off
      } else if (quantity >= 25) {
        basePrice = basePrice * 0.88; // 12% off
      } else if (quantity >= 10) {
        basePrice = basePrice * 0.94; // 6% off
      }
      printSurcharge = 0;
    } else if (sizeType === 'swatch_test') {
      basePrice = product.swatch_test_price;
      if (printOptions.requiresPrint) {
        printSurcharge = 1.00;
      }
    } else if (sizeType === 'swatch_big') {
      basePrice = product.swatch_big_price;
      if (printOptions.requiresPrint) {
        printSurcharge = 2.50;
      }
    } else {
      // Linear Meter option
      basePrice = product.price_per_meter * meters;
      if (printOptions.requiresPrint) {
        printSurcharge = product.print_surcharge_per_meter * meters;
      }
      // Apply wholesale tiers if meters >= tier min
      if (product.wholesaleTiers && meters) {
        const matchingTier = [...product.wholesaleTiers]
          .reverse()
          .find(t => meters >= t.minMeters);
        if (matchingTier) {
          basePrice = basePrice * (1 - matchingTier.discountPercent / 100);
        }
      }
    }

    if (selectedFabricVariant === 'Organic Bio-Washed') {
      basePrice += 40 * (sizeType === 'meter' ? meters : 1);
    } else if (selectedFabricVariant === 'Optic Bleached White') {
      basePrice += 25 * (sizeType === 'meter' ? meters : 1);
    }

    const calculatedPricePerUnit = Number((basePrice + printSurcharge).toFixed(2));
    const itemTotalPrice = Number((calculatedPricePerUnit * quantity).toFixed(2));

    return { calculatedPricePerUnit, itemTotalPrice };
  };

  const addToCart = (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters: number = 1,
    selectedFabricVariant?: string,
    extraOptions?: AddToCartExtraOptions
  ) => {
    const { calculatedPricePerUnit, itemTotalPrice } = calculateUnitAndItemPrice(
      product,
      sizeType,
      quantity,
      printOptions,
      meters,
      selectedFabricVariant
    );

    const newItem: CartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      product,
      sizeType,
      meters: sizeType === 'meter' ? meters : undefined,
      quantity,
      printOptions,
      calculatedPricePerUnit,
      itemTotalPrice,
      selectedFabricVariant,
      sizeBreakdown: extraOptions?.sizeBreakdown,
      customPreviewUrl: extraOptions?.customPreviewUrl || printOptions.designUrl,
      apparelProduct: extraOptions?.apparelProduct,
      apparelColor: extraOptions?.apparelColor,
      printPlacement: extraOptions?.printPlacement,
      jerseyCustomization: extraOptions?.jerseyCustomization
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const { calculatedPricePerUnit, itemTotalPrice } = calculateUnitAndItemPrice(
            item.product,
            item.sizeType,
            newQuantity,
            item.printOptions,
            item.meters || 1,
            item.selectedFabricVariant
          );

          // Adjust size breakdown proportionally if it exists
          let newSizeBreakdown = item.sizeBreakdown;
          if (item.sizeBreakdown) {
            const currentTotal = Object.values(item.sizeBreakdown).reduce((sum, v) => sum + (v || 0), 0);
            if (currentTotal > 0 && newQuantity !== currentTotal) {
              const sizes = Object.keys(item.sizeBreakdown);
              const countPerSize = Math.floor(newQuantity / sizes.length);
              const remainder = newQuantity % sizes.length;
              const updatedBreakdown: Record<string, number> = {};
              sizes.forEach((s, idx) => {
                updatedBreakdown[s] = countPerSize + (idx < remainder ? 1 : 0);
              });
              newSizeBreakdown = updatedBreakdown;
            }
          }

          return {
            ...item,
            quantity: newQuantity,
            sizeBreakdown: newSizeBreakdown,
            calculatedPricePerUnit,
            itemTotalPrice
          };
        }
        return item;
      })
    );
  };

  const updateSizeBreakdown = (cartItemId: string, sizeBreakdown: Record<string, number>) => {
    const totalQty = Object.values(sizeBreakdown).reduce((sum, n) => sum + (Number(n) || 0), 0);
    if (totalQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const { calculatedPricePerUnit, itemTotalPrice } = calculateUnitAndItemPrice(
            item.product,
            item.sizeType,
            totalQty,
            item.printOptions,
            item.meters || 1,
            item.selectedFabricVariant
          );
          return {
            ...item,
            quantity: totalQty,
            sizeBreakdown,
            calculatedPricePerUnit,
            itemTotalPrice
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'FABRICPRINT10' || normalized === 'WELCOME10') {
      setCouponCode(normalized);
      setDiscountAmount(0.10);
      return true;
    }
    if (normalized === 'BULKPRINT20') {
      setCouponCode(normalized);
      setDiscountAmount(0.20);
      return true;
    }
    return false;
  };

  const subtotal = Number(cart.reduce((sum, item) => sum + item.itemTotalPrice, 0).toFixed(2));
  const discount = Number((subtotal * discountAmount).toFixed(2));
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = Number(((subtotal - discount) * 0.05).toFixed(2));
  const total = Number((subtotal - discount + shippingFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSizeBreakdown,
        clearCart,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode,
        applyCoupon,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
