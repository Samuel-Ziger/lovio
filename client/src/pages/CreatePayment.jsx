import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import config from '../config/config';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const CreatePayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const iniciarPagamento = async () => {
      try {
        console.log('Testando conexão com o servidor...');
        // Teste de conexão
        const testResponse = await axios.get(`${config.backendUrl}/api/test`, {
          withCredentials: true
        });
        console.log('Teste de conexão:', testResponse.data);

        // Verificar saúde do servidor
        console.log('Verificando saúde do servidor...');
        const healthResponse = await axios.get(`${config.backendUrl}/api/health`, {
          withCredentials: true
        });
        console.log('Servidor online:', healthResponse.data);

        // Recuperar dados do localStorage
        const dados_site = {
          plano: localStorage.getItem('plan'),
          nome_site: localStorage.getItem('title'),
          slug: localStorage.getItem('title')?.toLowerCase().replace(/\s+/g, '-'),
          data_inicio: localStorage.getItem('date'),
          mensagem: localStorage.getItem('message')
        };

        console.log('Dados recuperados do localStorage:', dados_site);

        // Validar dados obrigatórios
        const camposObrigatorios = ['plano', 'nome_site', 'data_inicio', 'mensagem'];
        const camposFaltantes = camposObrigatorios.filter(campo => !dados_site[campo]);
        
        if (camposFaltantes.length > 0) {
          throw new Error(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
        }

        // Preparar dados para o backend
        const dadosParaBackend = {
          dados_site
        };

        console.log('Enviando dados para o backend:', dadosParaBackend);

        // Criar preferência de pagamento
        console.log('Criando preferência de pagamento...');
        const response = await axios.post(
          `${config.backendUrl}/api/pagamento/preferencia`,
          dadosParaBackend,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Resposta do servidor:', response.data);

        if (response.data.init_point) {
          // Redirecionar para o Mercado Pago
          window.location.href = response.data.init_point;
        } else {
          throw new Error('URL de pagamento não recebida');
        }
      } catch (error) {
        console.error('Erro ao iniciar pagamento:', error);
        console.log('Resposta do servidor:', error.response?.data);
        
        let errorMessage = 'Ocorreu um erro ao processar o pagamento.';
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    iniciarPagamento();
  }, [navigate]);

  const handleBack = () => {
    navigate('/create/plan');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Processando Pagamento</h2>
          <p className="text-gray-500 mt-2">Por favor, aguarde...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Erro no Pagamento</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CreatePayment; 