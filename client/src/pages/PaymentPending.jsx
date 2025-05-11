import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

const PaymentPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <FaClock className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pagamento Pendente</h2>
          <p className="text-gray-600 mb-6">
            Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail assim que for aprovado.
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

export default PaymentPending; 