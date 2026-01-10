export default function Hero({ title }) {
  return (
    <div className="bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{title}</h1>
      </div>
    </div>
  );
}
