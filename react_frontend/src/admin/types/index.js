/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {number} price
 * @property {number} discountPrice
 * @property {number} stock
 * @property {string} status
 * @property {string} sku
 * @property {string} image
 * @property {string} description
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} name
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customer
 * @property {string} email
 * @property {string} date
 * @property {number} total
 * @property {string} paymentStatus
 * @property {string} orderStatus
 * @property {string} paymentMethod
 * @property {OrderItem[]} items
 * @property {string} address
 */

export const OrderStatus = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
};
