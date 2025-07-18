const express = require('express');
const router = express.Router();
const { createPaymentIntent, getAllPayments, validatePayment } = require('../controllers/paymentController');
// Plus tard, on ajoutera un middleware pour vérifier que seul un admin peut accéder
// const { protect, admin } = require('../middleware/authMiddleware');

// Route pour l'utilisateur
router.post('/create-intent', createPaymentIntent);

// Routes pour l'admin
router.get('/', getAllPayments); // protect, admin, 
router.put('/:paymentId/validate', validatePayment); // protect, admin, 

module.exports = router;
