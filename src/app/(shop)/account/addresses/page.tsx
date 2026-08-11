import { AddressManager } from '@/components/account/AddressManager';
import { SupabaseNotice } from '@/components/account/SupabaseNotice';
import { buildMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient, getCurrentUser } from '@/utils/supabase/server';
import type { AddressRow } from '@/types/database';



// TODO: Password tip kontrollerini enum yapısına taşı
// TODO: bu alanlar özellikle title ve description için i18n ile çevrilebilir. 
// Ancak, bu alanlar SEO açısından önemli olduğundan, çevirilerdeki farklılıklar 
// SEO performansını etkileyebilir. Bu nedenle, bu alanları çevirmeden önce S
// EO etkilerini değerlendirmek önemlidir.
export const metadata = buildMetadata({
  title: 'Adreslerim',
  description: 'Teslimat adreslerinizi yönetin.',
  path: '/account/addresses',
  noIndex: true,
});

export default async function AddressesPage() {
  const session = await getCurrentUser();
  const supabase = await createClient();

  let addresses: AddressRow[] = [];

  if (supabase && session) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    addresses = data ?? [];
  }

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && <SupabaseNotice />}
      <AddressManager
        addresses={addresses}
        defaultName={session?.profile?.full_name ?? ''}
        defaultPhone={session?.profile?.phone ?? ''}
      />
    </div>
  );
}
