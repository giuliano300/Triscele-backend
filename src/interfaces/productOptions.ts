import { ProductsOptions } from "src/schemas/products-options.schema";

export interface ProductOptions {
  _id: string;
  position: number;
  option: ProductsOptions;
}
