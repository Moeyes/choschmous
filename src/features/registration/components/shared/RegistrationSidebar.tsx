// interface SidebarSection {
//   label: string;
//   value: string | null;
//   color: "indigo" | "purple" | "pink" | "emerald";
// }

// interface RegistrationSidebarProps {
//   sections: SidebarSection[];
//   gradientTo?: "purple" | "pink";
// }

// export function RegistrationSidebar({
//   sections,
//   gradientTo = "purple",
// }: RegistrationSidebarProps) {
//   return (
//     <div className="reg-sidebar">
//       <div
//         className={`reg-sidebar-content ${gradientTo === "pink" ? "to-pink" : ""}`}
//       >
//         {sections.map((section, index) => (
//           <div
//             key={section.label}
//             className={index === 0 ? "" : "reg-sidebar-section"}
//           >
//             <div className="reg-sidebar-label">
//               <div className={`reg-sidebar-dot ${section.color}`}></div>
//               <span className={`reg-sidebar-badge ${section.color}`}>
//                 {section.label}
//               </span>
//             </div>
//             <h3 className={`reg-sidebar-title ${section.color}`}>
//               {section.value || "Not selected"}
//             </h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
