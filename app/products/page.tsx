import ProductGrid from "@/components/ProductGrid";
import SearchForm from "@/components/SearchForm";
import { getProducts } from "@/services/productsServices";
import { Search } from "lucide-react";
export const metadata = {
  title: "لييبر بيتزا | البحث عن منتجات",
  description: "ابحث عن ألذ أنواع البيتزا والمقبلات في لييبر بيتزا",
};

export default async function Home(props: {
  searchParams: Promise<{ search_word?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { search_word } = searchParams;
  let products = [] as Awaited<ReturnType<typeof getProducts>>;

  if (search_word) {
    products = await getProducts("p_name", search_word, 50);
  } else {
    products = await getProducts("all", "", 100);
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SearchForm />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <ProductGrid products={products} showSort={true} />
      </div>
    </div>
  );
}
