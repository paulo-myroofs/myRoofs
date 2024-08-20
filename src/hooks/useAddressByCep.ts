import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

interface AddressInfo {
  uf: string;
  logradouro: string;
  localidade: string;
  bairro: string;
}

export function getAddressByCepQueryKey(cep: string) {
  return ["address", cep];
}

export const getAddressByCepQueryFn = (cep: string) => {
  const fetchAddressByCEP = async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: "GET"
    });
    if (response.ok) {
      const data = await response.json();
      const { uf, logradouro, localidade, bairro } = data;
      return {
        uf,
        bairro,
        logradouro,
        localidade
      };
    }

    return {};
  };

  return () => fetchAddressByCEP(cep);
};

const useAddressByCep = <T = AddressInfo>(
  cep: string,
  enableSearch: boolean,
  select?: (data: DocumentData) => T
) => {
  return useQuery(getAddressByCepQueryKey(cep), getAddressByCepQueryFn(cep), {
    select,
    cacheTime: 0,
    enabled: enableSearch,
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export default useAddressByCep;
