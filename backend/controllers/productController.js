const Product = require('../models/Product');
const sendSSE = require('../utils/sendSSE');

// ── Cloudinary setup ──────────────────────────────────────────────
let cloudinary, streamifier;
try {
  cloudinary   = require('cloudinary').v2;
  streamifier  = require('streamifier');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (e) {
  console.warn('Cloudinary/streamifier not available:', e.message);
}

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!cloudinary || !streamifier) {
      return reject(new Error('Cloudinary not configured. Run: npm install cloudinary streamifier'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'pr-peptides/products', transformation: [{ width: 900, crop: 'limit', quality: 'auto' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ── Helpers ───────────────────────────────────────────────────────
const parseBool = (val) => {
  if (val === 'true'  || val === true)  return true;
  if (val === 'false' || val === false) return false;
  return val;
};

const cleanData = (body) => {
  const d = { ...body };
  ['inStock','labTested','coaAvailable','researchUseOnly','featured']
    .forEach(k => { if (k in d) d[k] = parseBool(d[k]); });
  ['price','comparePrice','stockQuantity']
    .forEach(k => {
      if (d[k] !== undefined && d[k] !== '' && d[k] !== null) {
        const n = Number(d[k]);
        if (!isNaN(n)) d[k] = n;
        else delete d[k];
      } else {
        delete d[k]; // remove empty strings so Mongoose ignores them
      }
    });
  return d;
};

// ── Controllers ───────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, products, total, pages: Math.ceil(total / limit), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('CREATE body:', JSON.stringify(req.body));
    console.log('CREATE files:', req.files?.length ?? 0);

    const data = cleanData(req.body);

    if (req.files && req.files.length > 0) {
      data.images = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
    }

    const product = await Product.create(data);
    sendSSE({ type: 'product_added', message: `New product: ${product.name}`, productId: product._id });
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('CREATE ERROR:', err);
    res.status(500).json({ success: false, message: String(err.message || err) });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log('UPDATE id:', req.params.id);
    console.log('UPDATE body:', JSON.stringify(req.body));
    console.log('UPDATE files:', req.files?.length ?? 0);

    const data = cleanData(req.body);

    if (req.files && req.files.length > 0) {
      data.images = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: false }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    sendSSE({ type: 'product_updated', message: `Product updated: ${product.name}` });
    res.json({ success: true, product });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ success: false, message: String(err.message || err) });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};