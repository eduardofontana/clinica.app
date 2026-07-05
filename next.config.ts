import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Habilita `unauthorized()` e `redirect()` como interrupções de navegação
     * nativas no Next.js 16, substituindo `redirect()` de `next/navigation`
     * para casos de autenticação e autorização.
     *
     * docs: https://nextjs.org/docs/app/api-reference/functions/unauthorized
     */
    authInterrupts: true,
  },
};

export default nextConfig;
