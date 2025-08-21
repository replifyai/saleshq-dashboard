'use client'
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { chatApi, type Product } from "@/lib/apiUtils";
import { 
  LibraryHeader,
  EmptyState,
  LoadingState,
  ProductsGrid,
  ProductsList
} from "./components";
import { LibraryStats } from "./components/LibraryStats";

export default function DocumentLibrary() {
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => chatApi.getProducts(),
  });

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <Card className="custom-scrollbar" style={{height:'100vh',overflowY:'scroll'}}>
      <LibraryHeader 
        products={products}
        layout={layout}
        onLayoutChange={setLayout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <LibraryStats products={filteredProducts} totalProducts={products?.length || 0} />

      <CardContent>
        {isLoading ? (
          <LoadingState layout={layout} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {layout === 'grid' ? (
              <ProductsGrid products={filteredProducts} />
            ) : (
              <ProductsList products={filteredProducts} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
