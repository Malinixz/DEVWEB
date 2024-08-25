CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    criado_por INTEGER NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE TABLE membros_grupo (
    id SERIAL PRIMARY KEY,
    id_grupo INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    UNIQUE (id_grupo, id_usuario)
);

CREATE TYPE estado_atividade AS ENUM ('em andamento', 'concluído', 'pendente', 'cancelado', 'em revisão', 'atrasado');

CREATE TABLE atividades (
    id SERIAL PRIMARY KEY,
    id_grupo INTEGER NOT NULL,
    id_criador INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_entrega TIMESTAMP NOT NULL,
    estado estado_atividade NOT NULL DEFAULT 'pendente',
    data_conclusao TIMESTAMP,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    FOREIGN KEY (id_criador) REFERENCES usuarios(id)
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    id_atividade INTEGER NOT NULL,
    id_responsavel INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    estado estado_atividade NOT NULL DEFAULT 'pendente',
    data_entrega TIMESTAMP NOT NULL,
    data_conclusao TIMESTAMP,
    FOREIGN KEY (id_atividade) REFERENCES atividades(id),
    FOREIGN KEY (id_responsavel) REFERENCES usuarios(id)
);


CREATE TABLE mensagem (
    id SERIAL PRIMARY KEY,
    id_grupo INTEGER NOT NULL,
    autor INTEGER NOT NULL,
    texto VARCHAR(255) NOT NULL,
    eh_aviso BOOLEAN,
    data_hora TIMESTAMP NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    FOREIGN KEY (autor) REFERENCES usuarios(id)
);