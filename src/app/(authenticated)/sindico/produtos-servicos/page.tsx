"use client";

import { ProductEntity } from "@/common/entities/product";
import { ServiceEntity } from "@/common/entities/service";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import useProductsByCondoId, {
  getProductsByCondoIdQueryKey
} from "@/hooks/queries/products/useProductsByCondoId";
import useServicesByCondoId, {
  getServicesByCondoIdQueryKey
} from "@/hooks/queries/services/useServicesByCondoId";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { deleteFirestoreDoc } from "@/store/services";
import { storageGet } from "@/store/services/storage";
import shuffleArrays from "@/utils/shuffleArrays";

import RenderProductCardWContact from "./components/RenderProductCardWContact/RenderProductCardWContact";
import { RenderProductCardWContactProps } from "./components/RenderProductCardWContact/types";

const InternalMarket = () => {
  const condoId = storageGet<string>("condoId");

  const { data: products } = useProductsByCondoId(condoId, (data) =>
    data.map(
      (item: ProductEntity) =>
        ({
          id: item.id,
          title: item.name,
          image: item.image,
          contactId: item.createdBy,
          description: item.description,
          cardType: "Produto",
          value: item.price
        }) as RenderProductCardWContactProps
    )
  );
  const { data: services } = useServicesByCondoId(condoId, (data) =>
    data.map(
      (item: ServiceEntity) =>
        ({
          id: item.id,
          title: item.name,
          image: item.image,
          contactId: item.createdBy,
          cardType: "Serviço",
          description: item.description,
          value: null
        }) as RenderProductCardWContactProps
    )
  );

  const handleDeleteProduct = async (id: string) => {
    const { error } = await deleteFirestoreDoc({
      documentPath: `/products/${id}`
    });
    if (error) {
      return;
    }
    successToast("Produto deletado com sucesso!");
    queryClient.invalidateQueries(getProductsByCondoIdQueryKey(condoId));
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await deleteFirestoreDoc({
      documentPath: `/services/${id}`
    });
    if (error) {
      return;
    }
    successToast("Serviço deletado com sucesso!");
    queryClient.invalidateQueries(getServicesByCondoIdQueryKey(condoId));
  };

  if (!condoId) return;

  const shuffledArray = shuffleArrays<RenderProductCardWContactProps>(
    services ?? [],
    products ?? []
  );

  if (shuffledArray.length === 0) {
    return (
      <div className="mx-auto mt-32 h-[20vh] w-11/12 max-w-[1500px]">
        Sem resultado serviços ou produtos cadastrados ainda...
      </div>
    );
  }

  return (
    <section className="mx-auto mt-8 w-11/12 max-w-[1500px] space-y-8">
      <TitleAtom className="text-center">Produtos e Serviços</TitleAtom>
      <div className="grid w-full grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shuffledArray.map((item) => (
          <RenderProductCardWContact
            key={item.contactId + item.title}
            onRemove={
              item.cardType === "Produto"
                ? () => handleDeleteProduct(item.id)
                : () => handleDeleteService(item.id)
            }
            {...item}
          />
        ))}
      </div>
    </section>
  );
};

export default InternalMarket;
