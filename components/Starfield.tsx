const stars = Array.from({ length: 130 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  size: `${1 + (index % 4) * 0.7}px`,
  delay: `${(index % 17) * 0.22}s`
}));

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <span key={star.id} style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />
      ))}
      <i className="shooting shooting-one" />
      <i className="shooting shooting-two" />
      <i className="shooting shooting-three" />
    </div>
  );
}
