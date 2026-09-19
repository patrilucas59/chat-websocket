import { useState } from "react";
import UserSelect from "./components/UserSelect";
import ContactList from "./components/ContactList";

function App() {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [contatoSelecionado, setContatoSelecionado] = useState(null);

  if (!usuarioAtual) {
    return <UserSelect onSelecionar={setUsuarioAtual} />;
  }

  return (
    <div className="flex bg-gray-900 h-screen">
      <ContactList 
        usuarioAtual={usuarioAtual}
        contatoSelecionado={contatoSelecionado}
        onSelecionarContato={setContatoSelecionado}
      />
      <div className='flex-1 text-white p-4'>
        {contatoSelecionado ? (
          <p>Conversando com: {contatoSelecionado.nome}</p>
        ) : (
          <p>Selecione um contato para começar a conversar</p>
        )}
      </div>
    </div>
  );
}

export default App;