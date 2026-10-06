import PublicIcon from '@mui/icons-material/Public';
import SyncIcon from '@mui/icons-material/Sync';
import WifiIcon from '@mui/icons-material/Wifi';

const estados = {
  desconectado: {
    icone: <PublicIcon fontSize='small' />,
    texto: 'Desconectado',
    cor: 'text-gray-400',
  },
  conectando: {
    icone: <SyncIcon fontSize='small' className='animate-spin' />,
    texto: 'Conectando...',
    cor: 'text-yellow-400',
  },
  conectado: {
    icone: <WifiIcon fontSize='small' />,
    texto: 'Conectado',
    cor: 'text-green-400',
  },
};

function ConnectionStatus({ status }) {
  const { icone, texto, cor } = estados[status] ?? estados.desconectado;

  return (
    <div className={`flex items-center gap-2 text-xs ${cor}`}>
      {icone}
      <span>{texto}</span>
    </div>
  )
}

export default ConnectionStatus;