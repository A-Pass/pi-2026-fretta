import { NextResponse } from "next/server";
import ServicoClienteRepository from "@/repositories/ServicoClienteRepository";
import { headers } from "next/headers";
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { auth } from "@/lib/auth";
import { prismaToJson } from "@/helpers/serializers";


export async function POST(request) {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return NextResponse.json(
        { error: 'Não autorizado!' },
        { status: 401 }
    );

    const pessoa_id = session.user.id;

    const formData = await request.formData();

    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const data_hora_agendamento = formData.get('data_hora_agendamento');
    const valor_oferecido = formData.get('valor_oferecido');

    const arquivos_files = formData.getAll('arquivos'); // File[]...

    let uploadedFilesNames = [];
    const arquivos = [];

    try {
        for(let idx = 0; idx < arquivos_files.length; idx++) {
            const buffer = Buffer.from(await arquivos_files[idx].arrayBuffer());
            const md5 = crypto.createHash('md5').update(buffer).digest('hex');
            const ext = path.extname(arquivos_files[idx].name);
            const fileName = `${md5}${ext}`;
            const uploadDir = path.join(process.cwd(), '_storage_', 'files', session.user.id);
            await fs.mkdir(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);
            uploadedFilesNames.push(filePath);
            arquivos.push({
                md5,
                uri_img: arquivos_files[idx].name,
                ordem: idx
            });
        }

        const created = await ServicoClienteRepository.create(pessoa_id,
            titulo,
            descricao,
            data_hora_agendamento,
            valor_oferecido,
            arquivos
        );

    // Salvando imagens
        


        return NextResponse.json(
            { message: "Pedido criado com sucesso!", data: prismaToJson(created) },
            { status: 201 });

    } catch(err) {
        await Promise.allSettled(uploadedFilesNames.map(filePath => fs.unlink(filePath)));
        return NextResponse.json(
            { message: "Erro" + err.message },
            { status: 500 }
        );
    } 
}

export async function GET() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return NextResponse.json(
        { error: 'Não autorizado!' },
        { status: 401 }
    );

    const solicitacoes = await ServicoClienteRepository.findOpenServices(session.user.id);

    return NextResponse.json(
        prismaToJson(solicitacoes),
        { status: 200 });
}