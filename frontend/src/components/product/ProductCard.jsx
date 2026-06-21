import { Link } from 'react-router-dom';
import { formatRupiah, imageUrl, stockLabel, isReady, discountPercent } from '../../utils/format';

const ProductCard = ({ product }) => {
  const img = imageUrl(product.image);
  const ready = isReady(product.stock);
  const discount = discountPercent(product.price, product.price_before);

  return (
    <Link
      to={`/produk/${product.slug}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-soft hover:border-indigo-100 transition-all duration-300"
    >
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 text-6xl">
            📦
          </div>
        )}

        {!ready && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full tracking-wide">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Badge diskon */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white text-[11px] font-bold rounded-md shadow">
            -{discount}%
          </span>
        )}

        {/* Badge unggulan */}
        {product.is_featured && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[11px] font-bold rounded-md shadow">
            ⭐ Unggulan
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-700 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-extrabold text-slate-900 mt-2 tracking-tight">
          {formatRupiah(product.price)}
        </p>
        {discount > 0 && (
          <p className="text-xs text-slate-400 line-through -mt-0.5">
            {formatRupiah(product.price_before)}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2.5">
          {ready ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Ready
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400">Habis</span>
          )}
          {product.category && (
            <span className="text-[11px] text-slate-400">· {product.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
