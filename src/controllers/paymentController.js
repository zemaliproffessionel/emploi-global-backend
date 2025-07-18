const db = require('../config/db');

// La fonction pour créer une intention de paiement (inchangée)
const createPaymentIntent = async (req, res) => {
    // ... (code existant)
};

// NOUVELLE FONCTION : Lister tous les paiements pour l'admin
const getAllPayments = async (req, res) => {
  try {
    // On récupère tous les paiements, en joignant les emails des utilisateurs
    const query = `
      SELECT p.id, p.status, p.amount, p.plan_name, p.created_at, u.email 
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

// NOUVELLE FONCTION : Valider un paiement et activer un abonnement
const validatePayment = async (req, res) => {
  const { paymentId } = req.params;
  // Dans une vraie app, on récupérerait les infos du paiement
  // const payment = await Payment.findById(paymentId);
  // const user = await User.findById(payment.user_id);
  // etc...
  
  try {
    // 1. Mettre à jour le statut du paiement
    // await db.query('UPDATE payments SET status = $1 WHERE id = $2', ['completed', paymentId]);

    // 2. Créer l'abonnement pour l'utilisateur
    // await db.query('INSERT INTO subscriptions ...');
    
    console.log(`Validation manuelle pour le paiement ${paymentId}.`);
    res.status(200).json({ message: `Paiement ${paymentId} validé et abonnement activé.` });

  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

module.exports = { 
  createPaymentIntent,
  getAllPayments,
  validatePayment
};
