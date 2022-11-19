import { Ref } from "vue";

export interface NavRoot {
  activePath: string;
  updateActive: (path: string) => void;
  handleSelect: (path: string, item: any) => void;
  children: any[];
}
