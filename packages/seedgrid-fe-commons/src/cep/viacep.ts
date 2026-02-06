export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
};

export type CepLookupOptions = {
  signal?: AbortSignal;
};

function normalizeCep(value: string) {
  return value.replace(/\D/g, "");
}

export async function buscarCep(cep: string, options: CepLookupOptions = {}): Promise<ViaCepResponse> {
  const normalized = normalizeCep(cep);
  if (normalized.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos.");
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`, {
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar CEP (${response.status}).`);
  }

  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return data;
}
