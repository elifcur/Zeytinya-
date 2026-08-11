import { KeyRound, ShieldAlert } from 'lucide-react';
import { PasswordForm } from '@/components/account/PasswordForm';
import { SupabaseNotice } from '@/components/account/SupabaseNotice';
import { buildMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/utils/env';

export const metadata = buildMetadata({
  title: 'Şifre Değiştir',
  description: 'Hesap şifrenizi güncelleyin.',
  path: '/account/change-password',
  noIndex: true,
});

// TODO: Örnek passsword tipleri, kullanıcıya şifre oluştururken yardımcı olmak için kullanılabilir.

//export enum PasswordTip {
//   MIN_LENGTH = 'MIN_LENGTH',
//   CHARACTER_MIX = 'CHARACTER_MIX',
//   UNIQUE = 'UNIQUE',
//   NO_PERSONAL_INFO = 'NO_PERSONAL_INFO',
// }

// İleride değiştirmek istersen tipleri kolay olur. 
const tips = [
  'En az 8 karakter kullanın; 12 karakter ve üzeri belirgin şekilde daha güvenlidir.',
  'Büyük/küçük harf, rakam ve sembolü bir arada kullanın.',
  'Başka sitelerde kullandığınız bir şifreyi tekrar etmeyin.',
  'Doğum tarihi, isim veya telefon numarası gibi tahmin edilebilir bilgilerden kaçının.',
];

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && <SupabaseNotice />}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
          <KeyRound className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
          Şifre Değiştir
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Güvenliğiniz için mevcut şifrenizi doğrulamamız gerekiyor.
        </p>

        <div className="mt-6">
          <PasswordForm />
        </div>
      </section>

      <section className="rounded-2xl bg-surface-muted p-6">
        <h3 className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <ShieldAlert className="size-4.5 text-gold-600 dark:text-gold-400" strokeWidth={1.9} />
          Güçlü şifre önerileri
        </h3>
        <ul className="mt-4 space-y-2.5">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
