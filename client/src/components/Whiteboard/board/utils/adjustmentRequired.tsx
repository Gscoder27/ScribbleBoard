import { toolTypes } from "../../constants";

export const adjustmentRequired = (type: string) => [toolTypes.RECTANGLE, toolTypes.LINE, toolTypes.CIRCLE].includes(type);


