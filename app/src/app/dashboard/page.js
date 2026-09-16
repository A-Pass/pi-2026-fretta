'use client';
import { useSession } from '@/lib/auth-client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import DashboardCliente from "@/components/DashboardCliente";
import TelaPrestadorPage from "@/app/telaprestador/page.js";
import { 
  DEFAULT_ROUTE_SIGN_OUT,
  ROUTE_API_PESSOA,
  ROUTE_CADASRTO_GERAL
 } from '@/constants/routes';

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const [temPessoa, setTemPessoa] = useState(undefined)
  const [pessoa, setPessoa] = useState()
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user) {
      router.push(DEFAULT_ROUTE_SIGN_OUT);
      return;
    }

    if(temPessoa === false) {
      router.push(ROUTE_CADASRTO_GERAL);
      return;
    }

    if(temPessoa === undefined) {
      ;( async () => {
        try {
          const res = await fetch(
            `${ROUTE_API_PESSOA}/${session.user.id}`
          );
          if (res.status == 200) {
            setTemPessoa(true);
            setPessoa(await res.json())
          } else {
            setTemPessoa(false)
          }
        } catch (err) {
          console.error("Erro ao buscar pessoa:", err);
          setTemPessoa(false);
        }
      })();
    }
  }, [isPending, session?.user?.id, router, temPessoa, pessoa]);

  if (isPending || temPessoa === undefined || pessoa === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!pessoa.profissional) {
    return <DashboardCliente session={session} />;
  } else {
    return <TelaPrestadorPage session={session} />;
  }
}