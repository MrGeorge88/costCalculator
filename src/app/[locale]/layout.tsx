import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return {
    title: locale === 'es' ? 'Calculadora de Costos de Helados' : 'Ice Cream Cost Calculator',
    description: locale === 'es'
      ? 'Aplicación web para calcular costos de producción de helados con gestión de inventario y simulador de escenarios'
      : 'Web application for calculating ice cream production costs with inventory management and scenario simulator',
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-gray-50`} style={{ minHeight: '100vh', backgroundColor: '#f8fafc', margin: '0', padding: '0' }}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
