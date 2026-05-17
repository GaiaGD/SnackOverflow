import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

const COLORS = ['text-brand-yellow', 'text-brand-coral', 'text-brand-mint'];

interface ProductsBlockProps {
  title?: string;
  products: Product[];
}

export default function ProductsBlock({ title, products }: ProductsBlockProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-brand-navy">
      <div className="mx-auto max-w-5xl space-y-8">
        {title && (
          <h2 className="text-3xl text-white text-center">{title}</h2>
        )}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} {...product} color={COLORS[i % COLORS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
