import { useEffect, useState } from "react";
import http from "../api/http";

function ContactList({ usuarioAtual, onSelecionarContato, contatoSelecionado }) {
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
      <h2 className='text-white font-bold mb-4'>Contatos</h2>
      <ul className='flex flex-col gap-2'>
        {contatos.map((contato) => (
          <li key={contato.id}>
            <button
              onClick={() => onSelecionarContato(contato)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
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