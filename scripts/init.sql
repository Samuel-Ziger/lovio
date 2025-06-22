-- Script de inicialização do banco de dados
-- Este script será executado automaticamente quando o container MySQL for criado

USE namoromemoria;

-- Criar tabela de sites se não existir
CREATE TABLE IF NOT EXISTS `Sites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `nome_site` varchar(255) NOT NULL,
  `plano` enum('basic','premium','deluxe') NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_expiracao` datetime NOT NULL,
  `dados_json` text NOT NULL,
  `status` enum('ativo','expirado','pendente') NOT NULL DEFAULT 'ativo',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_data_expiracao` (`data_expiracao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Criar tabela de logs de pagamento
CREATE TABLE IF NOT EXISTS `PaymentLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` varchar(255) NOT NULL,
  `external_reference` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_data` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_id` (`payment_id`),
  KEY `idx_external_reference` (`external_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir dados de exemplo (opcional)
INSERT IGNORE INTO `Sites` (`slug`, `nome_site`, `plano`, `data_criacao`, `data_expiracao`, `dados_json`, `status`) VALUES
('exemplo-amor', 'Nosso Amor', 'premium', NOW(), DATE_ADD(NOW(), INTERVAL 2 YEAR), '{"titulo":"Nosso Amor","mensagem":"Para sempre juntos","data_inicio":"2023-01-01","imagens":[],"emojis":["💕","❤️"],"spotify_url":""}', 'ativo');

-- Mostrar mensagem de sucesso
SELECT 'Banco de dados configurado com sucesso!' as status; 