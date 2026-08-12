export function Interruptor({ ligado, aoAlternar, rotulo = 'Alternar' }) {
  return (
    <button
      type="button"
      className={ligado ? 'toggle on' : 'toggle'}
      onClick={aoAlternar}
      aria-label={rotulo}
      aria-pressed={ligado}
    />
  )
}
