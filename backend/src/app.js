const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const loanSchemesRoutes = require('./routes/loanSchemes.routes');
const leadsRoutes = require('./routes/leads.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1/loan-schemes', loanSchemesRoutes);
app.use('/api/v1/leads', leadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
