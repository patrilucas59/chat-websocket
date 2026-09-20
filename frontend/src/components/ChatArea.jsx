import { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

function ChatArea({ usuarioAtual, contatoSelecionado, mensagens, onEnviar }) {
  const [texto, setTexto] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleEnviar = (event) => {
    event.preventDefault();
    if (!texto.trim()) return;
    onEnviar(texto.trim());
    setTexto('');
  };

  if (!contatoSelecionado) {
    return (
      <div className='flex-1 flex items-center justify-center text-gray-400 bg-gray-900'>
        Selecione um contato para começar a conversar
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-bold">{contatoSelecionado.nome}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {mensagens.map((msg, index) => {
          const enviadaPorMim = Number(msg.remetente_id) === usuarioAtual.id;
          return (
            <div key={index} className={`flex ${enviadaPorMim ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                enviadaPorMim
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-700 text-gray-100 rounded-bl-none' 
              }`}
              >
                <p>{msg.conteudo}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleEnviar} className='p-4 border-t border-gray-700 flex gap-2'>
        <input 
          type='text'
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder='Digite uma mensagem...'
          className='flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600'
        />
        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer'
        >
          <SendIcon fontSize='small'/>
        </button>
      </form>
    </div>
  )
}

export default ChatArea;