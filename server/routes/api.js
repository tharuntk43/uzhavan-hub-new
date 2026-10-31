/**
 * Uzhavan Hub - Master REST API Router
 * Maps all 23 feature modules to their controllers with authentication guards
 */

import { Router } from '../utils/expressShim.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

import * as authController from '../controllers/authController.js';
import * as plotController from '../controllers/plotController.js';
import * as cropController from '../controllers/cropController.js';
import * as weatherController from '../controllers/weatherController.js';
import * as marketController from '../controllers/marketController.js';
import * as servicesController from '../controllers/servicesController.js';
import * as veterinaryController from '../controllers/veterinaryController.js';
import * as schemesController from '../controllers/schemesController.js';
import * as loansController from '../controllers/loansController.js';
import * as communityController from '../controllers/communityController.js';
import * as lingoController from '../controllers/lingoController.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Uzhavan Hub API',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Authentication (Modules 2 & 3)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/demo-login', authController.demoLogin);
router.post('/auth/logout', optionalAuth, authController.logout);
router.get('/auth/me', requireAuth, authController.getMe);
router.post('/auth/forgot-password', authController.forgotPassword);

// Land Plots (Modules 2 & 5)
router.get('/plots', requireAuth, plotController.listPlots);
router.post('/plots', requireAuth, plotController.addPlot);
router.put('/plots/:id', requireAuth, plotController.updatePlot);
router.delete('/plots/:id', requireAuth, plotController.deletePlot);
router.post('/plots/:id/activate', requireAuth, plotController.activatePlot);

// AI Crop Intelligence (Modules 6, 7, 8, 9, 10)
router.get('/crops/recommendations', optionalAuth, cropController.getRecommendations);
router.post('/crops/wizard', cropController.wizardRecommendations);
router.get('/crops/risk', optionalAuth, cropController.getRiskAlerts);
router.get('/crops/comparison', cropController.getComparisonTable);
router.post('/crops/doctor', cropController.doctorScan);

// Weather & Advisories (Module 11)
router.get('/weather', optionalAuth, weatherController.getWeather);

// Market Prices & Proceeds Calculator (Module 12)
router.get('/market/prices', marketController.getMarketPrices);
router.post('/market/calculate-proceeds', marketController.calculateProceeds);

// Farm Services: Labour & Machinery (Modules 13 & 14)
router.get('/services/labour', servicesController.getLabourListings);
router.post('/services/labour/book', requireAuth, servicesController.bookLabour);
router.get('/services/labour/my-bookings', requireAuth, servicesController.getMyLabourBookings);

router.get('/services/machinery', servicesController.getMachineryListings);
router.post('/services/machinery/book', requireAuth, servicesController.bookMachinery);
router.get('/services/machinery/my-bookings', requireAuth, servicesController.getMyMachineryBookings);

// Veterinary & Livestock (Module 15)
router.get('/veterinary', veterinaryController.getVeterinaryData);

// Government Schemes & Subsidies (Module 16)
router.get('/schemes', schemesController.getSchemes);
router.post('/schemes/check-eligibility', schemesController.checkEligibility);

// Agricultural Credit & Loans (Module 17)
router.post('/loans/calculate', loansController.calculateLoan);

// Community & Q&A Forum (Module 18)
router.get('/community/posts', communityController.getPosts);
router.post('/community/posts', requireAuth, communityController.createPost);
router.get('/community/posts/:id/replies', communityController.getReplies);
router.post('/community/posts/:id/replies', requireAuth, communityController.createReply);
router.post('/community/posts/:id/like', communityController.likePost);

// Farm Action Plan & Crop Calendar (Module 19)
router.get('/calendar/tasks', optionalAuth, communityController.getCalendarTasks);
router.patch('/calendar/tasks/:id', requireAuth, communityController.toggleTask);

// Fertilizer & Nutrient Management (Module 20)
router.post('/fertilizer/calculate', communityController.calculateFertilizer);

// FarmLingo Translation & Glossary (Module 21)
router.get('/lingo/glossary', lingoController.getLingoData);
router.post('/lingo/translate', lingoController.translatePhrase);

// Uzhavan AI Voice Assistant (Module 22)
router.post('/assistant/chat', optionalAuth, lingoController.assistantChat);

export default router;
