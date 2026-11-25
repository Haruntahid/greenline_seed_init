import express from 'express';
import { getDb } from '../db.js';
import { contactMetaData } from '../data/initialData.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/contact/meta - Contact page metadata
router.get('/meta', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('contact_meta').findOne({ _id: 'contact_meta' });
    if (!meta) meta = contactMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching contact meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact meta' });
  }
});

// PUT /api/contact/meta - Update contact page metadata
router.put('/meta', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'contact_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('contact_meta').updateOne(
      { _id: 'contact_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Contact meta updated', data: updateData });
  } catch (error) {
    console.error('Error updating contact meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update contact meta' });
  }
});

// POST /api/contact - Submit new contact message from public form
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { name, email, phone, subject, message, source } = req.body;

    if (!message || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Message and at least a Phone number or Email are required.' });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: (name || 'Visitor').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      source: (source || 'Website Inquiry').trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    await db.collection('contact_messages').insertOne(newMessage);
    res.status(201).json({ success: true, message: 'Thank you for reaching out! Your message has been received.', data: newMessage });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact message' });
  }
});

// GET /api/contact/messages - List all messages (Admin)
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const messages = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages' });
  }
});

// PATCH /api/contact/messages/:id - Toggle read/unread
router.patch('/messages/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { status } = req.body;
    const result = await db.collection('contact_messages').findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: status || 'read', updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
});

// DELETE /api/contact/messages/:id - Delete inquiry
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('contact_messages').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

export default router;
