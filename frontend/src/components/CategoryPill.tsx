import React from 'react';

interface CategoryPillProps {
  title: string;
  subtitle: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ title, subtitle }) => {
  return (
    <div className="category-pill">
      <div className="category-image-placeholder">IMG</div>
      <div className="category-text">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
};

export default CategoryPill;
