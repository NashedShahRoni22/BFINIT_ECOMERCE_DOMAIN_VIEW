import { componentMap } from "../config/componentMap";

export default function SectionRenderer({ sections = [] }) {
  const renderSection = (section, index) => {
    if (!section.visible) return null;

    const Component = componentMap[section.templateId];

    if (!Component) {
      console.warn(`Component not found for templateId: ${section.templateId}`);
      return (
        <div key={section.id} className="border-b bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            Preview not available for: {section.name}
          </p>
        </div>
      );
    }

    return (
      <Component
        key={section?.id || `section-${index}`}
        content={section.content}
      />
    );
  };

  return <>{sections?.map(renderSection)}</>;
}
