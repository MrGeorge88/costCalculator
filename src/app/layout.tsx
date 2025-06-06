import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora de Costos de Helados",
  description: "Aplicación para calcular costos de producción de helados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
