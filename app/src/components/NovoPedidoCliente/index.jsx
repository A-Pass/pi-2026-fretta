'use client';

import { useEffect, useState } from 'react';
import { X, Camera, ChevronLeft, CheckCircle2, Bookmark, Plus } from "lucide-react";
import {
    Dialog, CircularProgress,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, Radio,
    TextField,
    Typography,
    List,
    ListItem, ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Divider,
    Modal,
    Stack
} from "@mui/material";
import UFFormControl from '../forms/UFFormControl';
import { maskCEP, maskMoneyBR } from '@/helpers/masks';
import { ROUTE_API_ENDERECO, ROUTE_API_SERVICOS_CLIENTE } from '@/constants/routes'

// Tags de serviço
const SERVICE_TAGS = ["Varrer", "Passar Pano", "Lavar Banheiro", "Lavar Louça", "Limpar Vidros", "Tirar Pó", "Limpar Geladeira", "Passar Roupa", "Cozinhar", "Cortar Grama", "Limpar Piscina", "Organizar Armários", "Limpar Quintal", "Pós-Obra", "Lavar Garagem"];

export default function NovoPedidoCliente({ closeOrderAction = null }) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);
    const [enderecoInput, setEnderecoInput] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [files, setFiles] = useState([]);
    const [data, setData] = useState(new Date().toISOString().split("T")[0]);
    const [hora, setHora] = useState(new Date().toISOString().split("T")[1].substring(0, 5));
    const [valor_oferecido, setValorOferecido] = useState(0);
    // Modal de endereço
    async function usarLocalizacao() {
        if (!navigator.geolocation) {
            alert("Geolocalização não é suportada nesse navegador.");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Exemplo usando Nominatim (OpenStreetMap) para geocoding reverso
                const res = await fetch(`/api/geocode/?lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

                // Preencher campos do endereço
                setUF(data.address.state || "");
                setCidade(data.address.city || data.address.town || data.address.village || "");
                setBairro(data.address.suburb || data.address.neighbourhood || "");
                setLogradouro(data.address.road || "");
                setCep(data.address.postcode || "");
                setLoading(false);
            },
            (err) => {
                console.error(err);
                alert("Não foi possível obter sua localização.");
                setLoading(false);
            }
        );
    }



    const [loading, setLoading] = useState(false);
    const [openEnderecoModal, setOpenEnderecoModal] = useState(false);
    const [enderecos, setEnderecos] = useState(undefined);
    useEffect(() => {
        if (enderecos !== undefined) return;

        ; (async () => {
            try {
                const token = localStorage.getItem('token'); // ou via cookies
                const res = await fetch(ROUTE_API_ENDERECO, { credentials: 'same-origin' });
                if (res.status == 200) {
                    setEnderecos(await res.json());
                }
            } catch (err) {
                console.log('Falha na consulta de endereços do usuário!', err);
            }

        })();
    }, [openEnderecoModal, enderecos]);
    const [cep, setCep] = useState("");
    const [uf, setUF] = useState("");
    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [referencia, setReferencia] = useState("");
    const [selectedEndereo, setSelectedEndereco] = useState();

    // Buscar CEP via API pública (ViaCEP)
    useEffect(() => {
        if (!cep || cep.length < 9) return;
        setLoading(true);

        ; (async () => {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`);
                const data = await res.json();
                if (data.erro) return;
                setUF(data.uf || "");
                setCidade(data.localidade || "");
                setBairro(data.bairro || "");
                setLogradouro(data.logradouro || "");

                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar CEP", err);
                setLoading(false);
            }
        })();
    }, [cep]);

    const handlerSalvarEndereco = () => {
        setLoading(true);
        const novo = {
            cep, uf, cidade, bairro, logradouro, numero, complemento, referencia
        };
        ; (async () => {
            try {
                const res = await fetch(ROUTE_API_ENDERECO, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(novo)
                }
                );
                if (res.status == 201) {
                    const novoEndereco = await res.json();
                    console.log([...enderecos, novoEndereco]);
                    setEnderecos([...enderecos, novoEndereco]);
                    setSelectedEndereco(novoEndereco);
                    setOpenEnderecoModal(false);
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        })();

    };

    function enderecoLabel(a) {
        return `${a.logradouro.nome}, ${a.numero}, ${a.logradouro.bairro.nome}, ${a.logradouro.bairro.cidade.nome} - ${a.logradouro.bairro.cidade.uf_sigla}, ${a.logradouro.cep}`;
    }


    closeOrderAction = closeOrderAction || (() => { });

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    function solicitarImagens() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = (e) => {
            const selectedFiles = Array.from(e.target.files);
            const newFiles = selectedFiles.filter(
                f => !files.some(existing => existing.name === f.name && existing.size === f.size)
            );
            setFiles(prev => [...prev, ...newFiles]);
        };
        input.click();
    }

    function removeFile(fileToRemove) {
        setFiles(prev => prev.filter(file => file !== fileToRemove));
    }


    function handlerSalvarPedido() {
        setLoading(true);

        const novoPedidoForm = new FormData();

        novoPedidoForm.set('titulo', titulo);
        novoPedidoForm.set('descricao', descricao);
        novoPedidoForm.set('valor_oferecido', Number(valor_oferecido));
        let data_hora_agendamento = new Date(`${data}T${hora}:00`);
        novoPedidoForm.set('data_hora_agendamento', data_hora_agendamento.toISOString());
        novoPedidoForm.set('hora', hora);
        
        Array.from(files).forEach((file) => {
          novoPedidoForm.append('arquivos', file);
        });
       
        ; (async () => {
            try {
                const res = await fetch(ROUTE_API_SERVICOS_CLIENTE,
                    {
                        method: 'POST',
                        credentials: 'include',
                        body: novoPedidoForm
                    }
                );

                if (res.status == 201) {
                    setIsSuccess(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();


    }


    return (
        <Dialog fullScreen open onClose={closeOrderAction}>
            {isSuccess ? (
                <DialogContent className="flex flex-col items-center justify-center min-h-screen text-center p-8">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                        <CheckCircle2 size={48} />
                    </div>
                    <Typography variant="h5" className="mb-2 font-bold">Pedido Publicado!</Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={closeOrderAction}
                        style={{ backgroundColor: '#4f46e5', borderRadius: 12, padding: '14px', textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Ver Meus Pedidos
                    </Button>
                </DialogContent>
            ) : (
                <>
                    <DialogTitle className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {step > 1 && <Button onClick={() => setStep(step - 1)} variant="text"><ChevronLeft /></Button>}
                            <Typography variant="h6">Passo {step} de 3</Typography>
                        </div>
                        <Button onClick={closeOrderAction} variant="text"><X /></Button>
                    </DialogTitle>

                    <DialogContent className="p-6 max-w-lg mx-auto pb-32">
                        {/* Passo 1 */}
                        {step === 1 && (
                            <>
                                <Typography variant="h6" className="mb-4 font-bold">O que precisa ser feito?</Typography>
                                <div className="flex flex-wrap gap-3">
                                    {SERVICE_TAGS.map((tag) => (
                                        <Button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            variant={selectedTags.includes(tag) ? "contained" : "outlined"}
                                            color={selectedTags.includes(tag) ? "primary" : "inherit"}
                                            className="rounded-xl px-4 py-2 text-sm"
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Passo 2 */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <TextField
                                    label="Título do Anúncio"
                                    fullWidth
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Faxina completa"
                                    variant="outlined"
                                />
                                <TextField
                                    label="Descrição Detalhada"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Detalhes..."
                                    variant="outlined"
                                />

                                <div onClick={solicitarImagens} className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 cursor-pointer">
                                    <Camera size={32} className="mb-2" />
                                    <span>Adicionar fotos</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {files.map(file => (
                                        <div key={file.name + file.size} className="relative w-full h-32 border border-gray-300 rounded overflow-hidden">
                                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                                            <Button
                                                onClick={() => removeFile(file)}
                                                size="small"
                                                variant="contained"
                                                style={{ position: 'absolute', top: 4, right: 4, minWidth: 24, minHeight: 24, padding: 0, borderRadius: '50%', backgroundColor: 'red' }}
                                            >
                                                &times;
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Passo 3 */}
                        {step === 3 && (
                            <div className="space-y-8 text-center">
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <TextField
                                        type="date"
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                    />
                                    <TextField
                                        type="time"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
                                    />
                                </div>

                                <Box className="relative">
                                    <TextField
                                        value={enderecoInput}
                                        onChange={(e) => setEnderecoInput(e.target.value)}
                                        placeholder="Endereço Completo"
                                        fullWidth
                                    />
                                    <IconButton
                                        onClick={() => setOpenEnderecoModal(true)}
                                        style={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)' }}
                                    >
                                        <Bookmark size={20} />
                                    </IconButton>
                                </Box>

                                <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 mt-4">
                                    <Typography className="text-center mb-4 font-bold text-indigo-900">Quanto você pretende pagar?</Typography>
                                    <div className="relative max-w-[200px] mx-auto">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-indigo-400">R$</span>
                                        <TextField
                                            type="text"
                                            value={valor_oferecido}
                                            onChange={(e)=>{setValorOferecido(maskMoneyBR(e.target.value))}}
                                            placeholder="0,00"
                                            fullWidth
                                            variant="standard"
                                            inputProps={{ className: 'text-center text-indigo-900 font-black text-4xl' }}
                                        />
                                    </div>
                                </div>

                                {loading && <CircularProgress />}
                            </div>
                        )}
                    </DialogContent>

                    <DialogActions style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: 24 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={step === 1 && selectedTags.length === 0}
                            onClick={() => step < 3 ? setStep(step + 1) : handlerSalvarPedido()}
                            style={{
                                backgroundColor: step === 1 && selectedTags.length === 0 ? '#e2e8f0' : (step === 3 ? '#10b981' : '#4f46e5'),
                                color: 'white',
                                borderRadius: 12,
                                padding: 12,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            {step < 3 ? 'Continuar' : 'Publicar Solicitação'}
                        </Button>
                    </DialogActions>

                    {/* Modal de Endereços */}
                    <Modal
                        open={openEnderecoModal}
                        onClose={() => setOpenEnderecoModal(false)}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                maxWidth: 480,
                                height: '80vh',           // ocupa até 80% da altura
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 24,
                                display: 'flex',
                                flexDirection: 'column',  // permite scroll no conteúdo
                                p: 3,
                            }}
                        >
                            {/* Header */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Selecione um dos seus endereços:
                            </Typography>

                            {/* Lista de endereços */}
                            <Box
                                sx={{
                                    flex: '1 1 auto',               // ocupa todo o espaço restante
                                    maxHeight: '180px',    // altura máxima
                                    minHeight: '50px',  // altura mínima, se tiver poucos itens
                                    overflowY: 'auto',     // habilita scroll se passar do maxHeight
                                }}
                            >
                                <List>
                                    {enderecos?.map((a) => (
                                        <ListItem
                                            button="true"
                                            key={`${a.pessoa_id}_${a.logradouro_id}_${a.numero}`}
                                            onClick={() => {
                                                setEnderecoInput(enderecoLabel(a));
                                                setSelectedEndereco(a);
                                                setOpenEnderecoModal(false);
                                                setLoading(false);
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Radio
                                                    edge="start"
                                                    checked={selectedEndereo === a}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={enderecoLabel(a)} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Ou cadastre um novo:
                            </Typography>

                            <Stack spacing={2} sx={{ overflowY: 'auto', flex: 23 }}>
                                <Button variant="outlined" onClick={usarLocalizacao} disabled={loading}>
                                    {loading ? "Obtendo localização..." : "Usar minha localização"}
                                </Button>

                                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>ou</Typography>

                                <TextField
                                    label="CEP"
                                    value={cep}
                                    readOnly={loading}
                                    onChange={(e) => setCep(maskCEP(e.target.value))}
                                    fullWidth
                                    inputProps={{ maxLength: 9 }}
                                />
                                <UFFormControl value={uf} onChange={(e) => setUF(e.target.value)} fullWidth />
                                <TextField label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} fullWidth />
                                <TextField label="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} fullWidth />
                                <TextField label="Logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} fullWidth />
                                <TextField label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth />
                                <TextField label="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} fullWidth />
                                <TextField label="Ponto de Referência" value={referencia} onChange={(e) => setReferencia(e.target.value)} fullWidth />
                            </Stack>

                            {/* Footer fixo */}
                            <Box sx={{ mt: 2 }} >
                                <Button fullWidth variant="contained" disabled={loading} onClick={handlerSalvarEndereco}>
                                    {loading ? (
                                        <CircularProgress size={24} style={{ color: 'white', }} />
                                    ) : (
                                        'Salvar'
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                </>
            )}
        </Dialog>
    );
}
