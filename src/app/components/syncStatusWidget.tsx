import React from 'react';

interface SyncStatusWidgetProps {
  lastSync?: string | null;
  yampiId?: string | null;
  onSyncClick?: () => void;
  isSyncing?: boolean;
}

export const SyncStatusWidget: React.FC<SyncStatusWidgetProps> = ({
  lastSync,
  yampiId,
  onSyncClick,
  isSyncing = false
}) => {
  // Calcular quanto tempo desde a última sincronização
  const getTimeSinceLastSync = () => {
    if (!lastSync) return 'Nunca sincronizado';
    
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncDate.getTime();
    
    // Menos de um minuto
    if (diffMs < 60000) {
      return 'Agora mesmo';
    }
    
    // Menos de uma hora
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Menos de um dia
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Mais de um dia
    const days = Math.floor(diffMs / 86400000);
    return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  };
  
  const syncStatus = getTimeSinceLastSync();
  const needsSync = !lastSync || new Date(lastSync).getTime() < Date.now() - 3600000; // 1 hora
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Status de Sincronização</h3>
          <p className="text-xs text-gray-500">
            Última atualização: <span className={needsSync ? "text-orange-500 font-medium" : "text-green-600 font-medium"}>
              {syncStatus}
            </span>
          </p>
          {yampiId && (
            <p className="text-xs text-gray-500 mt-1">
              ID Yampi: <span className="font-mono">{yampiId}</span>
            </p>
          )}
        </div>
        
        {onSyncClick && (
          <button
            onClick={onSyncClick}
            disabled={isSyncing}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center 
              ${isSyncing 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : needsSync 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
          >
            {isSyncing ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sincronizando...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {needsSync ? 'Atualizar' : 'Sincronizado'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SyncStatusWidget; 