const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nama produk tidak boleh kosong'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Harga tidak boleh negatif'
      }
    }
  },
  price_before: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Harga asli sebelum diskon (untuk harga coret)'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stok tidak boleh negatif'
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image paths (max 5)',
    get() {
      const value = this.getDataValue('images');
      // Backward compatibility: convert old string format to array
      if (typeof value === 'string' && value) return [value];
      // Handle null/undefined
      if (!value) return [];
      // Already an array
      return value;
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Produk unggulan, tampil di section khusus'
  },
  sold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Jumlah terjual'
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
