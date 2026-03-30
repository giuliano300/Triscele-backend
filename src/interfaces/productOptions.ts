import { ProductUpDto } from "src/dto/productUp.dto";
import { Options } from "src/schemas/options.schema";

export interface ProductOptions {
  _id: string;
  position: number;
  option: Options;
  parent?: Options;
  parentProduct?: ProductUpDto;
}
