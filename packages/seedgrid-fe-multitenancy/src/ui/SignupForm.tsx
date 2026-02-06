"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  SgInputText,
  SgInputSelect,
  SgInputCNPJ,
  SgInputCPF,
  SgInputEmail,
  SgInputPassword,
  SgInputBirthDate,
  SgInputCEP,
  SgInputFone,
  SgGroupBox,
  isValidCnpj
} from "@seedgrid/fe-components";
import { buscarCep, buscarCnpj } from "@seedgrid/fe-commons";

type AddressForm = {
  street: string;
  number: string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  district: string;
  phone: string;
};

type LegalRepresentativeForm = {
  firstName: string;
  lastName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  whatsapp: string;
};

export type MultitenancySignupFormValues = {
  subdomain: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  address: AddressForm;
  legalRepresentative: LegalRepresentativeForm;
  rootEmail: string;
  plainRootPassword: string;
};

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const DEFAULT_VALUES: MultitenancySignupFormValues = {
  subdomain: "",
  cnpj: "",
  corporateName: "",
  tradeName: "",
  address: {
    street: "",
    number: "",
    complement: "",
    postalCode: "",
    city: "",
    state: "",
    district: "",
    phone: ""
  },
  legalRepresentative: {
    firstName: "",
    lastName: "",
    cpf: "",
    birthDate: "",
    phone: "",
    whatsapp: ""
  },
  rootEmail: "",
  plainRootPassword: ""
};

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p className="text-xs text-red-600">{props.message}</p>;
}


type SignupLabels = {
  title: string;
  subtitle: string;
  disclaimer: string;
  submit: string;
};

const DEFAULT_LABELS: SignupLabels = {
  title: "Crie sua conta em minutos",
  subtitle: "Preencha os dados abaixo para configurar sua conta e criar o acesso inicial ao {appName}.",
  disclaimer: "Ao continuar, você confirma que as informações fornecidas são verdadeiras.",
  submit: "Criar conta"
};

export function MultitenancySignupForm(props: { appName?: string; labels?: Partial<SignupLabels> }) {
  const [submitted, setSubmitted] = React.useState<MultitenancySignupFormValues | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<MultitenancySignupFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur"
  });

  const lastCnpjRef = React.useRef<string>("");
  const lastCepRef = React.useRef<string>("");

  const onSubmit = async (data: MultitenancySignupFormValues) => {
    setSubmitted(data);
  };

  const fillFromCnpj = React.useCallback(
    async (cnpjValue: string) => {
      const digits = cnpjValue.replace(/\D/g, "");
      if (digits.length !== 14 || !isValidCnpj(cnpjValue)) return;
      if (lastCnpjRef.current === digits) return;
      lastCnpjRef.current = digits;

      const data = await buscarCnpj(digits);
      if (!data) return;

      const estabelecimento = data.estabelecimento;
      const streetParts = [estabelecimento?.tipo_logradouro, estabelecimento?.logradouro].filter(Boolean);
      const street = streetParts.join(" ").trim();

      if (data.razao_social) {
        setValue("corporateName", data.razao_social, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.nome_fantasia) {
        setValue("tradeName", estabelecimento.nome_fantasia, { shouldDirty: true, shouldValidate: true });
      }
      if (street) {
        setValue("address.street", street, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.numero) {
        setValue("address.number", estabelecimento.numero, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.complemento) {
        setValue("address.complement", estabelecimento.complemento, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.bairro) {
        setValue("address.district", estabelecimento.bairro, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.cidade?.nome) {
        setValue("address.city", estabelecimento.cidade.nome, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.estado?.sigla) {
        setValue("address.state", estabelecimento.estado.sigla, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.cep) {
        setValue("address.postalCode", estabelecimento.cep, { shouldDirty: true, shouldValidate: true });
      }
      if (estabelecimento?.ddd1 && estabelecimento?.telefone1) {
        setValue(
          "address.phone",
          `${estabelecimento.ddd1}${estabelecimento.telefone1}`,
          { shouldDirty: true, shouldValidate: true }
        );
      }
    },
    [setValue]
  );

  const fillFromCep = React.useCallback(
    async (cepValue: string) => {
      const digits = cepValue.replace(/\D/g, "");
      if (digits.length !== 8) return;
      if (lastCepRef.current === digits) return;
      lastCepRef.current = digits;

      const data = await buscarCep(digits).catch(() => null);
      if (!data) return;

      if (data.logradouro) {
        setValue("address.street", data.logradouro, { shouldDirty: true, shouldValidate: true });
      }
      if (data.bairro) {
        setValue("address.district", data.bairro, { shouldDirty: true, shouldValidate: true });
      }
      if (data.localidade) {
        setValue("address.city", data.localidade, { shouldDirty: true, shouldValidate: true });
      }
      if (data.uf) {
        setValue("address.state", data.uf, { shouldDirty: true, shouldValidate: true });
      }
      if (data.complemento && !getValues("address.complement")) {
        setValue("address.complement", data.complemento, { shouldDirty: true, shouldValidate: true });
      }
    },
    [getValues, setValue]
  );

  const headerName = props.appName?.trim() || "SeedGrid Multitenancy";
  const labels = { ...DEFAULT_LABELS, ...(props.labels ?? {}) };
  const subtitle = labels.subtitle.replace("{appName}", headerName);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_55%),radial-gradient(circle_at_20%_20%,_hsl(var(--primary)/0.12),_transparent_45%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--background)))] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[hsl(var(--primary))]">{headerName}</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {labels.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70">
            {subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-border/60 bg-white/80 p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8"
        >
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Dados da empresa</h2>
              <p className="text-sm text-foreground/60">Use o domínio e as informações fiscais oficiais.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-12">
              {(() => {
                const cnpjRegister = register("cnpj");

                return (
                  <div className="space-y-1 sm:col-span-4">
                    <SgInputCNPJ
                      id="cnpj"
                      label="CNPJ"
                      error={errors.cnpj?.message}
                      required
                      requiredMessage="Informe o CNPJ."
                      lengthMessage="CNPJ deve ter 14 dígitos."
                      invalidMessage="CNPJ inválido."
                      inputProps={{
                        ...cnpjRegister,
                        onBlur: async (event) => {
                          cnpjRegister.onBlur(event);
                          await fillFromCnpj(event.currentTarget.value);
                        }
                      }}
                    />
                    <p className="text-xs text-foreground/50">Ao digitar o CNPJ, buscamos os dados na API.</p>
                  </div>
                );
              })()}

              <div className="sm:col-span-8">
                <SgInputText
                  id="corporateName"
                  label="Razão social"
                  error={errors.corporateName?.message}
                  inputProps={register("corporateName", { required: "Informe a razão social." })}
                />
              </div>

              <div className="sm:col-span-8">
                <SgInputText
                  id="tradeName"
                  label="Nome fantasia"
                  error={errors.tradeName?.message}
                  inputProps={register("tradeName", { required: "Informe o nome fantasia." })}
                />
              </div>

              <div className="sm:col-span-4">
                <SgInputText
                  id="subdomain"
                  label="Subdomínio"
                  error={errors.subdomain?.message}
                  inputProps={register("subdomain", {
                    required: "Informe o subdomínio.",
                    pattern: {
                      value: /^[a-z0-9-]{3,}$/i,
                      message: "Use apenas letras, números e hífen."
                    }
                  })}
                />
              </div>
            </div>

            <SgGroupBox title="Endereço">
              <div className="grid gap-4 sm:grid-cols-12">
                {(() => {
                  const cepRegister = register("address.postalCode");

                  return (
                    <div className="space-y-1 sm:col-span-2">
                      <SgInputCEP
                        id="address-postal"
                        label="CEP"
                        error={errors.address?.postalCode?.message}
                        required
                        requiredMessage="Informe o CEP."
                        lengthMessage="CEP deve ter 8 dígitos."
                        inputProps={{
                          ...cepRegister,
                          onBlur: async (event) => {
                            cepRegister.onBlur(event);
                            await fillFromCep(event.currentTarget.value);
                          }
                        }}
                      />
                      <p className="text-xs text-foreground/50">Ao digitar o CEP, buscamos o endereço.</p>
                    </div>
                  );
                })()}

                <div className="sm:col-span-7">
                  <SgInputText
                    id="address-street"
                    label="Rua"
                    error={errors.address?.street?.message}
                    inputProps={register("address.street", { required: "Informe a rua." })}
                  />
                </div>

                <div className="sm:col-span-3">
                  <SgInputText
                    id="address-number"
                    label="Número"
                    error={errors.address?.number?.message}
                    inputProps={register("address.number", { required: "Informe o número." })}
                  />
                </div>

                <div className="sm:col-span-5">
                  <SgInputText
                    id="address-complement"
                    label="Complemento"
                    error={errors.address?.complement?.message}
                    inputProps={register("address.complement")}
                  />
                </div>

                <div className="sm:col-span-3">
                  <SgInputSelect
                    id="address-state"
                    label="Estado"
                    error={errors.address?.state?.message}
                    options={STATES.map((state) => ({ value: state, label: state }))}
                    alwaysFloat
                    selectProps={register("address.state", { required: "Selecione o estado." })}
                  />
                </div>

                <div className="sm:col-span-4">
                  <SgInputText
                    id="address-city"
                    label="Cidade"
                    error={errors.address?.city?.message}
                    inputProps={register("address.city", { required: "Informe a cidade." })}
                  />
                </div>

                <div className="sm:col-span-7">
                  <SgInputText
                    id="address-district"
                    label="Bairro"
                    error={errors.address?.district?.message}
                    inputProps={register("address.district", { required: "Informe o bairro." })}
                  />
                </div>

                <div className="sm:col-span-5">
                <SgInputFone
                  id="address-phone"
                  label="Telefone"
                  error={errors.address?.phone?.message}
                  required
                  requiredMessage="Informe o telefone."
                  lengthMessage="Telefone inválido."
                  inputProps={register("address.phone")}
                />
                </div>
              </div>
            </SgGroupBox>
          </section>

          <SgGroupBox title="Responsável legal" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-12">
              <div className="sm:col-span-3">
                <SgInputCPF
                  id="legal-cpf"
                  label="CPF"
                  error={errors.legalRepresentative?.cpf?.message}
                  required
                  requiredMessage="Informe o CPF."
                  lengthMessage="CPF deve ter 11 dígitos."
                  invalidMessage="CPF inválido."
                  inputProps={register("legalRepresentative.cpf")}
                />
              </div>

              <div className="sm:col-span-6">
                <SgInputText
                  id="legal-first-name"
                  label="Nome"
                  error={errors.legalRepresentative?.firstName?.message}
                  inputProps={register("legalRepresentative.firstName", { required: "Informe o nome." })}
                />
              </div>

              <div className="sm:col-span-6">
                <SgInputText
                  id="legal-last-name"
                  label="Sobrenome"
                  error={errors.legalRepresentative?.lastName?.message}
                  inputProps={register("legalRepresentative.lastName", { required: "Informe o sobrenome." })}
                />
              </div>

              <div className="sm:col-span-4">
                {(() => {
                  const birthRegister = register("legalRepresentative.birthDate");

                  return (
                    <SgInputBirthDate
                      id="legal-birth"
                      label="Nascimento"
                      error={errors.legalRepresentative?.birthDate?.message}
                      minAge={18}
                      maxAge={100}
                      required
                      requiredMessage="Informe a data de nascimento."
                      alwaysFloat
                      inputProps={{ ...birthRegister }}
                    />
                  );
                })()}
              </div>

              <div className="sm:col-span-4">
                <SgInputFone
                  id="legal-phone"
                  label="Telefone"
                  error={errors.legalRepresentative?.phone?.message}
                  required
                  requiredMessage="Informe o telefone."
                  lengthMessage="Telefone inválido."
                  inputProps={register("legalRepresentative.phone")}
                />
              </div>

              <div className="sm:col-span-4">
                <SgInputFone
                  id="legal-whatsapp"
                  label="WhatsApp"
                  error={errors.legalRepresentative?.whatsapp?.message}
                  required
                  requiredMessage="Informe o WhatsApp."
                  lengthMessage="WhatsApp inválido."
                  inputProps={register("legalRepresentative.whatsapp")}
                />
              </div>
            </div>
          </SgGroupBox>

          <SgGroupBox title="Credenciais root" className="mt-6 max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <SgInputEmail
                id="root-email"
                label="Email"
                error={errors.rootEmail?.message}
                required
                requiredMessage="Informe o email."
                invalidMessage="Email inválido."
                inputProps={register("rootEmail")}
              />

              <SgInputPassword
                id="root-password"
                label="Senha inicial"
                error={errors.plainRootPassword?.message}
                required
                requiredMessage="Informe a senha."
                inputProps={register("plainRootPassword")}
              />
            </div>
          </SgGroupBox>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-foreground/60">
              {labels.disclaimer}
            </p>
            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-6 text-sm font-semibold text-white shadow-lg shadow-[hsl(var(--primary)/0.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {labels.submit}
            </button>
          </div>
        </form>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-border/60 bg-white/80 p-5 text-xs text-foreground/80 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-foreground">Resumo do payload</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}








