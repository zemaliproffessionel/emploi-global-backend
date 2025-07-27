const express = require('express' );
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// --- Configuration CORS ---
// On définit l'adresse de notre frontend
const allowedOrigins = ['https://emploi-global-frontend.onrender.com'];

const corsOptions = {
  origin: function (origin, callback ) {
    // On autorise les requêtes qui viennent de notre frontend
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// On applique la configuration CORS
app.use(cors(corsOptions));
// --- Fin de la configuration CORS ---

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Le serveur EmploiGlobal fonctionne !');
});

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
