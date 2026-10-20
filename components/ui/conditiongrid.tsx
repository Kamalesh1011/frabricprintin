"use client";
import React from "react";
import { MoveUpRight } from "lucide-react";
import { motion } from "motion/react";

export interface ProjectItem {
  id: string;
  img: string;
  title: string;
  des?: string;
  link?: string;
}

const defaultProjects: ProjectItem[] = [
  {
    id: "01",
    img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200",
    title: "Distrokings",
    des: "We make your logo communicate with your customers more than words ever could",
  },
  {
    id: "02",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200",
    title: "Profitables",
    des: "We are dedicated to unlocking your business potential through precision development",
  },
  {
    id: "03",
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=1200",
    title: "Topserve-copiers",
    des: "We are dedicated to unlocking your business potential through precision development",
  },
  {
    id: "04",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200",
    title: "Labramart.",
    des: "We specialize in crafting marketing solutions that propel your brand to new heights",
  },
];

export interface ConditionGridProps {
  items?: ProjectItem[];
  className?: string;
}

export function ConditionGrid({ items = defaultProjects, className = "" }: ConditionGridProps) {
  return (
    <div className={`grid grid-cols-12 gap-4 overflow-hidden px-5 lg:pb-5 pb-2 ${className}`}>
      {items.map((project, index) => {
        let colSpanClass = "sm:col-span-6 col-span-12";
        if (index === 0) {
          colSpanClass = "sm:col-span-5 col-span-12";
        } else if (index === 1) {
          colSpanClass = "sm:col-span-7 col-span-12";
        } else if (index === items.length - 2) {
          colSpanClass = "sm:col-span-7 col-span-12";
        } else if (index === items.length - 1) {
          colSpanClass = "sm:col-span-5 col-span-12";
        }
        return (
          <motion.article
            key={project.id ?? project.title}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            viewport={{ once: true }}
            className={`relative group cursor-pointer overflow-hidden rounded-2xl ${colSpanClass}`}
          >
            <div className="w-full h-[280px] sm:h-[340px] lg:h-[400px]">
              <img
                src={project?.img}
                alt={project?.title || "Project Image"}
                className="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
            <div className="absolute lg:bottom-3 bottom-2 text-black w-full p-4 flex justify-between items-center z-10">
              <h3 className="lg:text-sm text-xs font-bold bg-black text-white rounded-xl py-2 px-4 shadow-lg backdrop-blur-md">
                {project.title}
              </h3>
              <div className="lg:w-10 w-9 lg:h-10 h-9 text-white grid place-content-center rounded-full bg-black shadow-lg group-hover:bg-[#AC7900] transition-colors duration-300">
                <MoveUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

export default ConditionGrid;
