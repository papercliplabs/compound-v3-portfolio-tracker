export type TimeSelection = "7D" | "1M" | "3M" | "1Y" | "MAX";

export type DataGranularity = "hourly" | "daily" | "weekly";

export type Unit = "%" | "$";

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
