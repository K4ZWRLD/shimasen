const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, '../data/orders.json');

function loadOrders() {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load orders:', error);
    return [];
  }
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save orders:', error);
  }
}

module.exports = { loadOrders, saveOrders };
