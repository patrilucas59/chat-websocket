import { useEffect, useRef, useState } from "react";
import UserSelect from "./components/UserSelect";
import ContactList from "./components/ContactList";
import http from "./api/http";
import ChatArea from "./components/ChatArea";

function App() {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [contatoSelecionado, setContatoSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [onlineIds, setOnlineIds] = useState(new Set());

  const socketRef = useRef();
  const contatoSelecionadoRef = useRef(null);

  useEffect(() => {
    contatoSelecionadoRef.current = contatoSelecionado;
  }, [contatoSelecionado]);

  useEffect(() => {
    if (!usuarioAtual) return;

    const socket = new WebSocket(`ws://localhost:3333?userId=${usuarioAtual.id}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === 'online-list') {
        setOnlineIds(new Set(payload.ids.map(Number)));
      }

      if (payload.type === 'presence') {
        setOnlineIds((atual) => {
          const novo = new Set(atual);
          if (payload.status === 'online') {
            novo.add(Number(payload.userId));
          } else {
            novo.delete(Number(payload.userId));
          }
          return novo;
        });
        return;
      }

      if (payload.type === 'message') {
        const contatoAtivo = contatoSelecionadoRef.current;

      if (contatoAtivo && Number(payload.remetenteId) === contatoAtivo.id) {
        setMensagens((atual) => [
          ...atual,
          {
            remetente_id: payload.remetenteId,
            destinatario_id: usuarioAtual.id,
            conteudo: payload.conteudo,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };
  }    

    return () => {
      socket.close();
    };
  }, [usuarioAtual]);

  useEffect(() => {
    if (!usuarioAtual || !contatoSelecionado) return;
    
  http.get(`/mensagens/${usuarioAtual.id}/${contatoSelecionado.id}`)
    .then((res) => setMensagens(res.data))
    .catch((err) => console.log('Erro ao buscar histórico:', err.message))
  }, [usuarioAtual, contatoSelecionado]);

  const voltarParaSelecao = () => {
    socketRef.current?.close();
    setUsuarioAtual(null);
    setContatoSelecionado(null);
    setMensagens([]);
  }

  const enviarMensagem = (conteudo) => {
    if (!contatoSelecionado || !socketRef.current) return;

    socketRef.current.send(JSON.stringify({
      destinatarioId: contatoSelecionado.id,
      conteudo,
    }));

    setMensagens((atual) => [
      ...atual,
      {
        remetente_id: usuarioAtual.id,
        destinatario_id: contatoSelecionado.id,
        conteudo,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  if (!usuarioAtual) {
    return <UserSelect onSelecionar={setUsuarioAtual} />;
  }

  return (
    <div className="flex bg-gray-900 h-screen">
      <ContactList 
        usuarioAtual={usuarioAtual}
        contatoSelecionado={contatoSelecionado}
        onSelecionarContato={setContatoSelecionado}
        onVoltar={voltarParaSelecao}
        onlineIds={onlineIds}
      />
      <ChatArea
        usuarioAtual={usuarioAtual}
        contatoSelecionado={contatoSelecionado}
        mensagens={contatoSelecionado ? mensagens : []}
        onEnviar={enviarMensagem}
      />
    </div>
  );
}

export default App;