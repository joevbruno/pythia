import * as _enums from '@/enums'

export default function enums(val, key) {
  const opts = _enums[key]

  if (!opts) {
    return val
  }

  return opts[val]
}
