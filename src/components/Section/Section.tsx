import React, { ReactNode } from "react";
import "./Section.css";

const Section: React.FC<{ heading: string; children: ReactNode }> = ({heading,children}) => {
  return (
    <section>
      <div className="container">
        <h1>{heading}</h1>
        {children}
      </div>
    </section>
  );
};

export default Section;
