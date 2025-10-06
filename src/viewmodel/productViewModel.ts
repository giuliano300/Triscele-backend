import { SubProducts } from "src/interfaces/subProduct";
import { Category } from "src/schemas/category.schema";
import { ProductMovements } from "src/schemas/product-movement.schema";
import { Supplier } from "src/schemas/suppliers.schema";

export interface ProductViewModel {
  id: string;
  name: string;
  internalCode: string;
  price: number;
  cost: number;
  theshold: number;
  enabled: boolean;
  stock_type: string;
  description?: string;
  files?: unknown[];
  amazonCode?: string;
  ebayCode?: string;
  wcCode?: string;
  manomanoCode?: string;
  supplierCode?: string;
  categoryId?: string;
  supplierId?: string;
  category: Category | null;
  supplier: Supplier | null;
  stock: number;
  productMovements?: ProductMovements[];
  subProducts?: SubProducts[];
}