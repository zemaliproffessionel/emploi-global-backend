const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes'); // <-- LIGNE AJOUTÉE

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Le serveur EmploiGlobal fonctionne !');
});

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes); // <-- LIGNE AJOUTÉE

module.exports = app;
