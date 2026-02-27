import { mockProducts, mockOrders } from '../data/mockData';

// Simulating API calls
export const getProducts = () => Promise.resolve(mockProducts);
export const getOrders = () => Promise.resolve(mockOrders);
export const deleteProduct = (id) => Promise.resolve({ success: true, id });
export const updateProduct = (id, data) => Promise.resolve({ success: true, ...data });
