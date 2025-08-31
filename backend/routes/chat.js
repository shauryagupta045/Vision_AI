const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all chats for a user
router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching chats for user:', req.user.id);
        const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        console.log('Chats found:', chats.length);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats', error });
    }
});

// Get a specific chat
router.get('/:id', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat', error });
    }
});

// Create a new chat
router.post('/', auth, async (req, res) => {
    try {
        const newChat = new Chat({
            userId: req.user.id,
            messages: []
        });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: 'Error creating chat', error });
    }
});

// Add a message to a chat
router.post('/:id/messages', auth, async (req, res) => {
    const { role, content } = req.body;
    
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        chat.messages.push({ role, content });
        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error adding message', error });
    }
});

// Update chat title
router.patch('/:id/title', auth, async (req, res) => {
    const { title } = req.body;
    
    try {
        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title },
            { new: true }
        );
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error updating chat title', error });
    }
});

// Delete a chat
router.delete('/:id', auth, async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat', error });
    }
});

module.exports = router;
