// app/api/fotos/[id]/route.ts
import { readFile } from 'fs/promises';
import path from 'path';
import { auth } from "@/lib/auth";
import ServicoClienteFotoRepository from '@/repositories/ServicoClienteFotoRepository';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(req, { params }) {
    const { servico_cliente_id, md5 } = await params


    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session ) return NextResponse.json(
        { error: 'Não autorizado!' },
        { status: 401 }
    );

    const defaultResponseNotFound = new NextResponse('Não encontrado!', { status: 404 });

    if (servico_cliente_id == 'undefined' || md5 == 'undefined')
        return defaultResponseNotFound

    const servico = await ServicoClienteFotoRepository.findSpecific(servico_cliente_id, md5);

    if (!servico || servico_cliente_id == 'undefined' || md5 == 'undefined') 
        return defaultResponseNotFound

    const ext = path.extname(servico.uri_img).replace('.','');

    const filePath = path.join(process.cwd(), '_storage_', 'files', session.user.id, md5 + '.' +ext);

    try {
        const file = await readFile(filePath);
        return new Response(file, {
            headers: {
                'Content-Type': `image/${ext}`,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (err) {
        return new NextResponse(null, { status: 404 });
    }
}

