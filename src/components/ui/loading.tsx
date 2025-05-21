/**
 * LoadingSpinner é um componente de overlay de carregamento que ocupa toda a tela.
 * Útil para indicar estados de carregamento global (ex: ao enviar um formulário ou carregar dados).
 *
 * @param {object} props - Propriedades do componente.
 * @param {boolean} [props.fullscreen=true] - Define se o spinner ocupa a tela inteira como overlay.
 * @param {number} [props.size=48] - Tamanho do spinner (largura/altura em pixels).
 * @param {string} [props.color="border-blue-500"] - Cor da borda visível do spinner. Use classes Tailwind.
 * @param {string} [props.className=""] - Classe opcional para aplicar estilos adicionais.
 *
 * @returns {JSX.Element} Overlay com spinner centralizado na tela.
 *
 * @example
 * // Overlay fullscreen padrão
 * <LoadingSpinner />
 *
 * @example
 * // Tamanho e cor personalizados
 * <LoadingSpinner size={64} color="border-red-500" />
 *
 * @example
 * // Apenas o spinner (sem overlay)
 * <LoadingSpinner fullscreen={false} />
 */
export default function LoadingSpinner({
  fullscreen = true,
  size = 48,
  color = "border-blue-500",
  className = "",
}: {
  fullscreen?: boolean;
  size?: number;
  color?: string;
  className?: string;
}) {
  const wrapperClass = fullscreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    : `flex items-center justify-center ${className}`;

  return (
    <div className={wrapperClass}>
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
