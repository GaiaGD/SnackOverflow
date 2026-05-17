import { climateCrisis } from '@/lib/fonts';

export interface Product {
  id: string;
  productTitle: string;
  productDescription?: string;
}

interface ProductCardProps extends Product {
  color: string;
}

export default function ProductCard({ productTitle, productDescription, color }: ProductCardProps) {
  return (
    <article className="w-72 p-6 flex flex-col gap-2 text-center transition-transform duration-300 hover:scale-105">
      <h3 className={`${climateCrisis.className} text-3xl ${color}`}>{productTitle}</h3>
      {productDescription && (
        <p className="text-m text-white/70">{productDescription}</p>
      )}
    </article>
  );
}
