import { Ref } from 'vue'

export interface NavRoot {
  activePath: any
  updateActive: (path: any) => void
  handleSelect: (path: any, item: any) => void
  children: any[]
}
