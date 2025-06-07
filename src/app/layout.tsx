import { Inter } from 'next/font/google';
import './globals.css';
import './compiled.css';
import './fallback.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Calculadora de Costos de Helados',
  description: 'Aplicación web para calcular costos de producción de helados con gestión de inventario y simulador de escenarios',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
