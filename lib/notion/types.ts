import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type ValueOf<T> = T[keyof T];

export type RawNotionPageProperty = PageObjectResponse["properties"];
export type NotionPageProtertyType = ValueOf<RawNotionPageProperty>["type"];

export type NotionPageProperty<Type extends NotionPageProtertyType> = Extract<
  RawNotionPageProperty[keyof RawNotionPageProperty],
  { type: Type }
>;

export type NotionPageObjectResponse<
  PropertyNamesMap extends Record<string, NotionPageProtertyType>
> = Omit<PageObjectResponse, 'properties'> & {
  properties: {
    [PropertyName in keyof PropertyNamesMap]: NotionPageProperty<PropertyNamesMap[PropertyName]>;
  };
};
