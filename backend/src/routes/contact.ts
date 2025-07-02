import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message
      }
    });

    // Here you could add webhook notification to Discord/Slack
    // or send email notification

    res.status(201).json({
      message: 'Contact form submitted successfully',
      id: contact.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contacts (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

