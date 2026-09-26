class LogService {
    async registrarAccion(mensaje) {
      // Simula guardado asíncrono en BD/Archivo/Servicio Externo
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulación de fallo aleatorio (opcional) para validar manejo de error
          if (Math.random() < 0.05) {
            reject(new Error('Falló el servidor de logs'));
          } else {
            console.log(`[LOG REGISTRADO]: ${mensaje}`);
            resolve();
          }
        }, 300);
      });
    }
  }
  
  module.exports = new LogService();