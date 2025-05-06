const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const QRCode = require('qrcode');

// Criar nova página de homenagem
router.post('/', async (req, res) => {
  try {
    const memory = new Memory(req.body);
    
    // Gerar QR Code
    const url = `${process.env.FRONTEND_URL}/memory/${memory.customUrl}`;
    const qrCode = await QRCode.toDataURL(url);
    memory.qrCode = qrCode;
    
    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Buscar página por URL personalizada
router.get('/:customUrl', async (req, res) => {
  try {
    const memory = await Memory.findOne({ customUrl: req.params.customUrl });
    if (!memory) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar mensagem
router.post('/:customUrl/messages', async (req, res) => {
  try {
    const memory = await Memory.findOne({ customUrl: req.params.customUrl });
    if (!memory) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    memory.messages.push(req.body);
    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar tema
router.patch('/:customUrl/theme', async (req, res) => {
  try {
    const memory = await Memory.findOneAndUpdate(
      { customUrl: req.params.customUrl },
      { theme: req.body.theme },
      { new: true }
    );
    if (!memory) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(memory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 