import { CartView } from '@/components/cart/CartView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sepetim',
  description: 'Sepetinizdeki ürünleri gözden geçirin, kupon uygulayın ve ödemeye geçin.',
  path: '/cart',
  noIndex: true,
});
// TODO : 
export default function CartPage() {
  return (
    <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
      <Container>
        
        <Breadcrumbs
          trail={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Sepetim', path: '/cart' },
          ]}
        />
        <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">Sepetim</h1>
        <p className="mt-3 text-muted-foreground">
          Siparişinizi tamamlamadan önce ürünlerinizi kontrol edin.
        </p>

        <div className="mt-10">
          <CartView />
        </div>
      </Container>
    </div>
  );
}
