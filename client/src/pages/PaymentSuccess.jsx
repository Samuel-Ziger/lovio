import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpar dados do localStorage após pagamento bem-sucedido
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('title');
    localStorage.removeItem('date');
    localStorage.removeItem('message');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pagamento Aprovado!</h2>
          <p className="text-gray-600 mb-6">
            Seu site será criado em instantes. Você receberá um e-mail com as instruções de acesso.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 