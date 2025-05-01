import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import cookieParser from 'cookie-parser';
import clerkWebhookRoute from './routes/clerkWebhook.js';
import formRoutes from './routes/formRoutes.js';
import userRoutes from './routes/useRouter.js';
import { Form } from './models/Form.js';
import User from './models/User.js';
import Role from './models/Role.js';
import { QuizResponse } from './models/QuizResponse.js';
import { syncClerkUsers } from './syncUsers.js';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(clerkMiddleware());

// Routes
app.use('/api/clerk', clerkWebhookRoute);  // Clerk webhook routes
app.use('/api', userRoutes);  // User routes
app.use('/api/forms', formRoutes);  // Form routes

// Sequelize Associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(Form, { foreignKey: 'userId' });
Form.belongsTo(User, { foreignKey: 'userId' });

Form.hasMany(QuizResponse, { foreignKey: 'formId' });
QuizResponse.belongsTo(Form, { foreignKey: 'formId' });

// Utility: Error handler
const handleError = (res, message, err, status = 500) => {
  console.error(message, err);
  res.status(status).json({ message, error: err?.message || err });
};

const initializeRolesAndAdmin = async () => {
  try {
    // Find or create default roles if needed
    // Assuming you have a roles table, initialize the roles if necessary.

    // Find or create the admin user
    const [adminUser, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' }, // Use email to find or create user
      defaults: {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        password: 'adminPassword',  // If using password from Clerk, leave this empty
        role: 'admin'
      }
    });

    if (created) {
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

  } catch (error) {
    console.error('Error initializing roles and admin user:', error);
  }
};



// Clerk Webhook Endpoint (Manually Verifying Signature)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  try {
    // Manually verify the signature using 'crypto' library
    const signature = req.headers['clerk-signature'];
    const payload = req.body;

    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (computedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // If signature is valid, process the webhook event
    const event = JSON.parse(payload);  // Assuming payload is a JSON string

    if (event.type === 'user.created') {
      const { email, first_name, last_name, id } = event.data;

      const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });

      await User.create({
        id,
        email,
        first_name,
        last_name,
        username: email,
        password: await bcrypt.hash('clerk', 10),
        roleId: userRole.id
      });

      console.log('✅ Clerk user synced:', email);
    }

    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    handleError(res, 'Webhook verification failed or insert failed', error, 400);
  }
});

// Sync user on client login
app.post('/api/sync-user', requireAuth(), async (req, res) => {
  const { userId: clerkUserId } = req.auth;
  const { username } = req.body;

  try {
    const [role] = await Role.findOrCreate({ where: { name: 'user' } });

    const [user, created] = await User.findOrCreate({
      where: { id: clerkUserId },
      defaults: {
        id: clerkUserId,
        username: username || clerkUserId,
        password: await bcrypt.hash('clerk', 10),
        roleId: role.id
      }
    });

    res.status(200).json({ message: created ? 'User created' : 'User exists', user });
  } catch (err) {
    handleError(res, 'Error syncing user', err);
  }
});

// Form CRUD Routes
app.post('/api/forms', requireAuth(), async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.auth;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description required' });
  }

  try {
    const form = await Form.create({ title, description, userId });
    res.status(201).json(form);
  } catch (err) {
    handleError(res, 'Error creating form', err);
  }
});

app.get('/api/forms', requireAuth(), async (req, res) => {
  const { userId } = req.auth;
  const { page = 1, limit = 10 } = req.query;

  try {
    const forms = await Form.findAll({
      where: { userId },
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });
    res.status(200).json(forms);
  } catch (err) {
    handleError(res, 'Error fetching forms', err);
  }
});

app.put('/api/forms/:id', requireAuth(), async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.auth;
  const { id } = req.params;

  try {
    const form = await Form.findOne({ where: { id, userId } });
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.title = title || form.title;
    form.description = description || form.description;
    await form.save();

    res.status(200).json(form);
  } catch (err) {
    handleError(res, 'Error updating form', err);
  }
});

app.delete('/api/forms/:id', requireAuth(), async (req, res) => {
  const { userId } = req.auth;
  const { id } = req.params;

  try {
    const form = await Form.findOne({ where: { id, userId } });
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await form.destroy();
    res.status(200).json({ message: 'Form deleted' });
  } catch (err) {
    handleError(res, 'Error deleting form', err);
  }
});

// Quiz Responses Routes
app.post('/api/quiz-response', requireAuth(), async (req, res) => {
  const { formId, answers } = req.body;
  if (!formId || !answers) return res.status(400).json({ message: 'Form ID and answers required' });

  try {
    const response = await QuizResponse.create({ formId, answers });
    res.status(201).json(response);
  } catch (err) {
    handleError(res, 'Error submitting quiz', err);
  }
});

app.get('/api/quiz-response/:formId', requireAuth(), async (req, res) => {
  const { formId } = req.params;
  try {
    const responses = await QuizResponse.findAll({ where: { formId } });
    res.status(200).json(responses);
  } catch (err) {
    handleError(res, 'Error fetching responses', err);
  }
});

// Sync Clerk users manually via API
app.post('/api/sync-clerk-users', async (req, res) => {
  try {
    await syncClerkUsers();
    res.status(200).json({ message: 'Clerk users synced successfully' });
  } catch (err) {
    handleError(res, 'Error syncing Clerk users', err);
  }
});

// Start Server
initializeRolesAndAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

export { User, Role, Form, QuizResponse };
