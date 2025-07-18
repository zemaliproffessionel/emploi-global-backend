const db = require('../config/db');

const createPaymentIntent = async (req, res) => {
  // Pour l'instant, on ne fait que simuler la création d'une intention de paiement.
  // L'ID de l'utilisateur viendra du token JWT plus tard.
  const { planName, amount } = req.body;
  const userId = 'some-user-id'; // A remplacer par req.user.id

  try {
    const query = `
      INSERT INTO payments (user_id, amount, method, status, plan_name)
      VALUES ($1, $2, 'virement', 'pending', $3)
      RETURNING id;
    `;
    // Note: La colonne 'plan_name' doit être ajoutée à votre table 'payments'.
    const values = [userId, amount, planName];
    
    // Cette partie est commentée car elle nécessite une vraie connexion DB et une modification de table.
    // const result = await db.query(query, values);
    // const paymentId = result.rows[0].id;

    console.log(`Intention de paiement créée pour ${userId}, plan ${planName}, montant ${amount}`);

    res.status(201).json({ 
      message: 'Intention de paiement enregistrée. Veuillez suivre les instructions.',
      paymentId: 'simulated-' + Date.now() // On simule un ID de paiement
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

module.exports = { createPaymentIntent };
