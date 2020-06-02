import { FormValidationSchema } from "../Types";
import * as Yup from "yup";
import Joi from "@hapi/joi";

export type Flower = {
  name: string;
  color: string;
  petals: number;
};

export const mockFlower: Flower = {
  name: "Orchid",
  color: "Purple",
  petals: 2,
};

export const MOCK_SCHEMA_PETALS_ERROR: string = "A flower should have petals";

export const mockSchema: FormValidationSchema<Flower> = {
  name: Yup.string().min(5),
  color: (f: Flower) => !!f.color,
  petals: (f: Flower) => f.petals > 0 || MOCK_SCHEMA_PETALS_ERROR,
};

export const mockAltSchema: FormValidationSchema<Flower> = {
  ...(mockSchema as Joi.ObjectSchema),
  name: Joi.string().min(5),
};
