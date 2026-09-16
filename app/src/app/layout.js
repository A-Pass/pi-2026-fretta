import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// 1. Configurando a fonte Inter para carregar todos os pesos
const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter', // Cria uma variável CSS para usarmos globalmente
});

export const metadata = {
  title: "HomeClean",
  description: "Agendamento de limpeza doméstica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* 2. Injetamos a variável da fonte no corpo do site */}
      <body className={`${inter.variable} antialiased`}>
        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}