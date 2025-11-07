import { ConfigProductToOrder } from "./configProductToOrder";
import { ProductOptions } from "./productOptions";

export interface OrderProducts {
  _id: string;
  name: string;
  quantity: string;
  price: number;
  discount: number;
  discountPercentage: number;
  discountPercentage2: number;
  total: number;
  isSubs?:boolean;
  note?:string;
  parentId?: string;
  options?: ProductOptions[];
  selectedOptions?: ConfigProductToOrder[];
}
