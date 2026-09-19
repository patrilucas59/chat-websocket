import { useEffect, useState } from "react";
import http from "../api/http";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ContactList({ usuarioAtual, onSelecionarContato, contatoSelecionado, onVoltar }) {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    http.get('/usuarios')
      .then((res) => {
        const outros = res.data.filter((u) => u.id !== usuarioAtual.id);
        setContatos(outros);
      })
      .catch((err) => console.log('Erro ao buscar contatos:', err.message));
  }, [usuarioAtual]);

  return (
    <div className='w-64 bg-gray-800 h-screen p-4'>
      <div className="flex flex-row items-center gap-2 mb-4">
        <button
          onClick={onVoltar}
          className="text-gray-300 hover:text-white transition cursor-pointer"
          title="Trocar de usuário"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        <h2 className='text-white font-bold'>Contatos</h2>
      </div>
      <ul className='flex flex-col gap-2'>
        {contatos.map((contato) => (
          <li key={contato.id}>
            <button
              onClick={() => onSelecionarContato(contato)}
              className={`w-full text-left px-3 py-2 rounded-lg transition cursor-pointer ${
               contatoSelecionado?.id === contato.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'                 
              }`}
            >
              {contato.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContactList;