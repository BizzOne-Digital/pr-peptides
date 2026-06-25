const Order = require('../models/Order');
const Product = require('../models/Product');
const sendSSE = require('../utils/sendSSE');
const { sendEmail, orderConfirmationHTML } = require('../utils/email');

exports.createOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod, notes } = req.body;
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      subtotal += product.price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity: item.quantity, dosage: product.dosage });
    }
    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal + shippingCost;
    const order = await Order.create({ customer, shippingAddress, items: orderItems, subtotal, shippingCost, total, paymentMethod, notes });
    
    // SSE broadcast
    sendSSE({ type: 'new_order', message: `New order #${order.orderNumber} from ${customer.name}`, orderId: order._id, amount: total });
    
    // Send confirmation email
    sendEmail({ to: customer.email, subject: `Order Confirmed - #${order.orderNumber}`, html: orderConfirmationHTML(order) });
    
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('items.product', 'name images').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, ...(trackingNumber && { trackingNumber }) }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    sendSSE({ type: 'order_status', message: `Order #${order.orderNumber} status: ${status}`, orderId: order._id });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalRevenue, totalProducts] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Product.countDocuments({ isActive: true })
    ]);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts
      },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
