class SSEClients {
    constructor() {
      this.clients = new Map();
    }
  
    addClient(userId, res) {
      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }
      this.clients.get(userId).add(res);
    }
  
    removeClient(userId, res) {
      if (this.clients.has(userId)) {
        const userClients = this.clients.get(userId);
        userClients.delete(res);
        if (userClients.size === 0) {
          this.clients.delete(userId);
        }
      }
    }
  
    broadcast(userId, data) {
      if (this.clients.has(userId)) {
        this.clients.get(userId).forEach(client => {
          client.write(data);
        });
      }
    }
  }
  
  module.exports = new SSEClients();