import { useEffect, useState } from "react";
import http from "../api/http";

function UserSelect({ onSelecionar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    http.get('/usuarios')
    .then((res) => setUsuarios(res.data))
    .catch((err) => console.log('Erro ao buscar usuários:', err.message))
    .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <p className='text-white p-4'>Carregando usuários...</p>
    );
  }

  return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <h1 className="text-white text-5xl font-bold mb-6">Quem é você?</h1>
        <div className="flex flex-row space-x-5 gap-3">
          {usuarios.map((usuario) => (
            <button
              key={usuario.id}
              onClick={() => onSelecionar(usuario)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-2xl px-8 py-5 rounded-lg transition cursor-pointer"
            >
              {usuario.nome}
            </button>
          ))}
        </div>
      </div>
    );
  }

export default UserSelect;