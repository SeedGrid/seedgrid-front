export type PublicaCnpjResponse = {
  cnpj_raiz: string;
  razao_social: string;
  capital_social: string;
  responsavel_federativo: string;
  atualizado_em: string;
  porte: { id: string; descricao: string };
  natureza_juridica: { id: string; descricao: string };
  qualificacao_do_responsavel: { id: number; descricao: string };
  socios: Array<{
    cpf_cnpj_socio: string;
    nome: string;
    tipo: string;
    data_entrada: string;
    cpf_representante_legal: string;
    nome_representante: string | null;
    faixa_etaria: string;
    atualizado_em: string;
    pais_id: string;
    qualificacao_socio: { id: number; descricao: string };
    qualificacao_representante: { id: number; descricao: string } | null;
    pais: { id: string; iso2: string; iso3: string; nome: string; comex_id: string };
  }>;
  simples: {
    mei: string;
    simples: string;
    data_opcao_mei: string | null;
    data_exclusao_mei: string | null;
    data_opcao_simples: string | null;
    data_exclusao_simples: string | null;
    atualizado_em: string;
  };
  estabelecimento: {
    cnpj: string;
    atividades_secundarias: Array<{
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    }>;
    cnpj_raiz: string;
    cnpj_ordem: string;
    cnpj_digito_verificador: string;
    tipo: string;
    nome_fantasia: string;
    situacao_cadastral: string;
    data_situacao_cadastral: string;
    data_inicio_atividade: string;
    nome_cidade_exterior: string | null;
    tipo_logradouro: string;
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cep: string;
    ddd1: string;
    telefone1: string;
    ddd2: string | null;
    telefone2: string | null;
    ddd_fax: string | null;
    fax: string | null;
    email: string | null;
    situacao_especial: string | null;
    data_situacao_especial: string | null;
    atualizado_em: string;
    atividade_principal: {
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    };
    pais: { id: string; iso2: string; iso3: string; nome: string; comex_id: string };
    estado: { id: number; nome: string; sigla: string; ibge_id: number };
    cidade: { id: number; nome: string; ibge_id: number; siafi_id: string };
    motivo_situacao_cadastral: string | null;
    inscricoes_estaduais: Array<{
      inscricao_estadual: string;
      ativo: boolean;
      atualizado_em: string;
      estado: { id: number; nome: string; sigla: string; ibge_id: number };
    }>;
  };
};

export type CnpjLookupOptions = {
  signal?: AbortSignal;
};

function normalizeCnpj(value: string) {
  return value.replace(/\D/g, "");
}

export async function buscarCnpj(
  cnpj: string,
  options: CnpjLookupOptions = {}
): Promise<PublicaCnpjResponse | null> {
  const normalized = normalizeCnpj(cnpj);
  if (normalized.length !== 14) {
    throw new Error("CNPJ deve ter 14 dígitos.");
  }

  try {
    const response = await fetch(`https://publica.cnpj.ws/cnpj/${normalized}`, {
      signal: options.signal
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PublicaCnpjResponse;
  } catch {
    return null;
  }
}
