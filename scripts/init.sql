-- Script de inicialização do banco de dados Lovio
-- Este script é executado automaticamente quando o container MySQL é criado

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS lovio_db;
USE lovio_db;

-- Criar tabela de sites
CREATE TABLE IF NOT EXISTS sites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  nome_site VARCHAR(255) NOT NULL,
  plano ENUM('basic', 'premium', 'deluxe') NOT NULL DEFAULT 'basic',
  data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_expiracao DATETIME NOT NULL,
  dados_json JSON NOT NULL,
  status ENUM('ativo', 'inativo', 'pendente') NOT NULL DEFAULT 'pendente',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_data_expiracao (data_expiracao),
  INDEX idx_plano (plano)
);

-- Inserir dados de exemplo (opcional)
INSERT IGNORE INTO sites (slug, nome_site, plano, data_criacao, data_expiracao, dados_json, status) VALUES
('exemplo-amor', 'Exemplo de Site de Amor', 'premium', NOW(), DATE_ADD(NOW(), INTERVAL 2 YEAR), 
 '{"titulo": "Nosso Amor", "mensagem": "Para sempre juntos!", "data": "2024-01-01", "imagens": [], "emojis": ["💕", "❤️"], "musica": null}', 
 'ativo');

-- Criar usuário se não existir (para compatibilidade)
CREATE USER IF NOT EXISTS 'lovio_user'@'%' IDENTIFIED BY 'lovio123';
GRANT ALL PRIVILEGES ON lovio_db.* TO 'lovio_user'@'%';
FLUSH PRIVILEGES;

-- Mostrar informações do banco
SELECT 'Lovio Database initialized successfully!' as message;
SELECT COUNT(*) as total_sites FROM sites; 