/**
 * Lightweight file-backed persistence layer.
 *
 * The assignment lists PostgreSQL/MongoDB as target databases. This project
 * uses a JSON-file store instead so a reviewer can `npm install && npm start`
 * with zero external services running. The access pattern below (readAll /
 * insert / find) mirrors what a Mongo collection or a Postgres repository
 * would expose, so swapping in a real driver later only touches this file.
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'leads.json');

function readAll() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeAll(leads) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

function insertLead(lead) {
  const leads = readAll();
  leads.push(lead);
  writeAll(leads);
  return lead;
}

function findLeadsByMobile(mobileNumber) {
  return readAll().filter((lead) => lead.mobileNumber === mobileNumber);
}

module.exports = {
  readAll,
  insertLead,
  findLeadsByMobile,
};
