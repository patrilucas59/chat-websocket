import { useState } from "react";
import UserSelect from "./components/UserSelect";

function App() {
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  if (!usuarioAtual) {
    return <UserSelect onSelecionar={setUsuarioAtual} />;
  }

  return (
    <div className="text-white p-4 bg-gray-900 h-screen">
      <p>Logado como: {usuarioAtual.nome} (id: {usuarioAtual.id})</p>
    </div>
  );
}

export default App;