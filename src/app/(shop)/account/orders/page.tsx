import { ArrowRight, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SupabaseNotice } from '@/components/account/SupabaseNotice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';
import { blurDataURL, formatDate, formatPrice } from '@/lib/utils';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient, getCurrentUser } from '@/utils/supabase/server';
import type { OrderItemRow, OrderRow, OrderStatus } from '@/types/database';

export const metadata = buildMetadata({
  title: 'Siparişlerim',
  description: 'Geçmiş siparişlerinizi görüntüleyin ve kargo durumunu takip edin.',
  path: '/account/orders',
  noIndex: true,
});


// TODO: PasswordTips'lerinde neden yapmadın burada var 
// Güzel yaklaşım.. 
const statusMeta: Record<OrderStatus, { label: string; tone: 'gold' | 'olive' | 'success' | 'warning' | 'neutral' }> = {
  pending: { label: 'Ödeme Bekliyor', tone: 'warning' },
  paid: { label: 'Ödeme Alındı', tone: 'gold' },
  preparing: { label: 'Hazırlanıyor', tone: 'gold' },
  shipped: { label: 'Kargoda', tone: 'olive' },
  delivered: { label: 'Teslim Edildi', tone: 'success' },
  cancelled: { label: 'İptal Edildi', tone: 'neutral' },
  refunded: { label: 'İade Edildi', tone: 'neutral' },
};

type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

export default async function OrdersPage() {
  const session = await getCurrentUser();
  const supabase = await createClient();

  let orders: OrderWithItems[] = [];

  if (supabase && session) {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    orders = (data as OrderWithItems[] | null) ?? [];
  }
// TODO: Hard cord içeriyor 
  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && <SupabaseNotice />}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft sm:p-16">
          <span className="grid size-20 place-items-center rounded-full bg-surface-muted">
            <Package className="size-8 text-muted-foreground" strokeWidth={1.3} />
          </span>
          <h2 className="mt-6 font-display text-2xl text-foreground">Henüz siparişiniz yok</h2>

          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            İlk siparişinizi verdiğinizde tüm detayları — kargo durumu dâhil — bu sayfadan takip
            edebileceksiniz.
          </p>
          <Button href="/products" variant="gold" size="lg" className="mt-7">
            Ürünleri İncele
            <ArrowRight className="size-4" strokeWidth={2.2} />
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const meta = statusMeta[order.status];
            return (
              <li
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-shadow duration-400 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-muted/60 px-5 py-4">
                  <div>
                    <p className="font-medium text-foreground tabular-nums">{order.order_no}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(order.created_at)} · {order.order_items.length} ürün
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <ul className="divide-y divide-border">
                  {order.order_items.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-center gap-3.5 px-5 py-3.5">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {item.image_url && (
                          <Image
                            src={item.image_url}
                            alt=""
                            fill
                            sizes="56px"
                            placeholder="blur"
                            blurDataURL={blurDataURL()}
                            className="object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product_slug}`}
                          className="line-clamp-1 text-sm font-medium text-foreground transition-colors hover:text-gold-600"
                        >
                          {item.product_name}
                        </Link>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.variant_label} · {item.quantity} adet
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-foreground tabular-nums">
                        {formatPrice(item.line_total)}
                      </span>
                    </li>
                  ))}
                </ul>

                {order.order_items.length > 3 && (
                  <p className="px-5 pb-3 text-xs text-muted-foreground">
                    +{order.order_items.length - 3} ürün daha
                  </p>
                )}

                {order.tracking_number && (
                  <div className="flex flex-wrap items-center gap-2.5 border-t border-border px-5 py-3.5 text-sm">
                    <Truck className="size-4 shrink-0 text-olive-600 dark:text-gold-400" strokeWidth={1.9} />
                    <span className="text-muted-foreground">
                      {order.carrier ?? 'Kargo'} takip no:
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      {order.tracking_number}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
